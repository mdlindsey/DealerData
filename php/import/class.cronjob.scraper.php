<?php
namespace CronJob;
class Scraper extends \CronJob {
  private $storeId, $zip, $page, $limit, $radius, $url, $json;
  private $pageWorkerId;

  function __construct() {
    parent::__construct();
    $this->GetNextIndex()->GenerateURL()->ScrapeDataFromAPI()->ProcessScrapedData();
  }

  public function Output() {
    // If the page didn't die, we know it succeeded
    return json_encode([
      'index'=>$this->page,
      'location'=>$this->zip,
    ]);
  }


  private function GetNextIndex() {
    $getDealership = $this->CarMaxDB->Fetch('Dealerships', 'StoreId,Zip', 'ORDER BY Modified ASC LIMIT 1');
    if ( !$getDealership )
      $this->Error('no dealerships found');
    $this->storeId = $getDealership['StoreId'];
    $getWorkerPage = $this->CronJobDB->Fetch('Workers', 'WorkerId,WorkerIndex', ['WorkerRef'=>'Scraper.Inventory.CarMax.Page']);
    $getWorkerPerPage = $this->CronJobDB->Fetch('Workers', 'WorkerIndex', ['WorkerRef'=>'Scraper.Inventory.CarMax.PerPage']);
    $getWorkerZipRadius = $this->CronJobDB->Fetch('Workers', 'WorkerIndex', ['WorkerRef'=>'Scraper.Inventory.CarMax.Radius']);

    $this->zip = $getDealership['Zip'];
    $this->page = ( !$getWorkerPage ) ? 1 : $getWorkerPage['WorkerIndex'];
    $this->limit = ( !$getWorkerPerPage ) ? 50 : $getWorkerPerPage['WorkerIndex'];
    $this->radius = ( !$getWorkerZipRadius ) ? 10 : $getWorkerZipRadius['WorkerIndex'];
    $this->pageWorkerId = $getWorkerPage ? $getWorkerPage['WorkerId'] : false;

    return $this;
  }

  public function GetURL() {
    return 'https://api.carmax.com/v1/api/vehicles?'.
      'Zip='.         $this->zip                                           .'&'.
      'Distance='.    $this->radius                                        .'&'.
      'Page='.        $this->page                                          .'&'.
      'PerPage='.     $this->limit                                         .'&'.
      'StartIndex='.  max(0, $this->page-1) * $this->limit                 .'&'.
      'SortKey='.     1                                                    .'&'.
      'Refinements=&ExposedDimensions=249+250+1001+1000+265+999+772&'.
      'Sorts=0+14+6+9&ExposedCategories=249+250+1001+1000+265+999+772&platform=carmax.com&'.
      'apikey='.      'adfb3ba2-b212-411e-89e1-35adab91b600';
  }

  private function GenerateURL() {
    $this->url = $this->GetURL();
    return $this;
  }

  private function ScrapeDataFromAPI() {
    $this->json = file_get_contents($this->url);
    return $this;
  }

  private function ProcessScrapedData() {
    $decoded = json_decode($this->json, 1);

    // If the result is empty, fetch the next result from DealerData_CarMax.Dealerships (Modified ASC)
    //    ^^ after fetching the next result, update the Modified time of the previous Dealership
    // If result is not empty, store result and add one to the page number in Scraper.Inventory.CarMax
    if ( !isset($decoded['Results']) || !sizeof($decoded['Results']) )
      return $this->ProcessEmptyData();

    // We know its valid data at this point
    $this->IncrementWorkerIndex();

    $savedFields = [
      'StoreId',
      'Vin',
      'Year',
      'Make',
      'Model',
      'Miles' => function($abbreviatedMileage) {
        return (int)preg_replace('#k$#i', '000', $abbreviatedMileage);
      },
      'Price',
      'ExteriorColor',
      'InteriorColor',
      'DriveTrain',
      'Transmission',
      'Highlights',
      'MpgCity',
      'MpgHighway',
      'Cylinders',
      'EngineSize',
      'NewTireCount',
      'NumberOfReviews',
      'AverageRating',
      'StockNumber',
    ];

    foreach($decoded['Results'] as $result) {
      $resultData = ['FirstSeen'=>time(), 'LastSeen'=>time()];
      foreach($result as $attr=>$value) {
        // Fields can be array items (no handler) or an index (specific handler)
        if ( in_array($attr, $savedFields) )
          $resultData[$attr] = $value;
        if ( array_key_exists($attr, $savedFields) && is_callable($savedFields[$attr]) )
          $resultData[$attr] = $savedFields[$attr]($value);
      }
      $this->ProcessVehicle($resultData);
    }
    return $this;
  }

  private function ProcessEmptyData() {
    $this->CarMaxDB->Update('Dealerships', ['Modified'=>time()], ['StoreId'=>$this->storeId]);
    $this->CronJobDB->Update('Workers', [
      'WorkerIndex'=>0,
      'Modified'=>time()
    ], ['WorkerRef'=>'Scraper.Inventory.CarMax.Page']);
    return $this;
  }

  private function IncrementWorkerIndex() {
    if ( $this->pageWorkerId )
      $this->CronJobDB->Update('Workers', [
        'WorkerIndex'=>$this->page+1,
        'Modified'=>time()
      ], ['WorkerRef'=>'Scraper.Inventory.CarMax.Page']);
    else
      $this->CronJobDB->Create('Workers', [
        'WorkerRef'=>'Scraper.Inventory.CarMax.Page',
        'WorkerIndex'=>$this->page+1,
        'Modified' => time()
      ]);
    return $this;
  }

  private function ProcessVehicle($vehicleData) {
    // Check if vehicle already exists
    $existingVehicleData = $this->CarMaxDB->Fetch('Vehicles', '*', ['Vin'=>$vehicleData['Vin']]);
    if ( $existingVehicleData )
      $this->UpdateVehicle($vehicleData, $existingVehicleData);
    else
      $this->CarMaxDB->Create('Vehicles', $vehicleData);
    return $this;
  }

  private function UpdateVehicle($newVehicleData, $oldVehicleData) {
    // Check for move
    if ( $newVehicleData['StoreId'] != $oldVehicleData['StoreId'] )
      $this->CarMaxDB->Create('Moves', [
        'Vin' => $newVehicleData['Vin'],
        'Created' => time(),
        'OldStoreId' => $oldVehicleData['StoreId'],
        'NewStoreId' => $newVehicleData['StoreId']
      ]);
    $combinedVehicleData = $newVehicleData;
    $combinedVehicleData['FirstSeen'] = $oldVehicleData['FirstSeen'];
    $this->CarMaxDB->Update('Vehicles', $combinedVehicleData, ['Vin'=>$combinedVehicleData['Vin']]);
    // Check for sale in different cron that scans db for LastSeen's over a week old
    return $this;
  }

  function __destruct() {
    if ( $this->pageWorkerId )
      $this->CronJobDB->Create('Output', [
        'WorkerId'=>$this->pageWorkerId,
        'Output'=>$this->Output(),
        'Runtime'=>elapsed_execution_time(),
        'Created'=>time()
      ]);
  }


} // Conclude Class CronJob/Scraper
?>
