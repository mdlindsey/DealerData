<?php
namespace CronJob;
class Sales extends \CronJob {
  private $newSales;
  private $thresholdWorkerId;
  function __construct() {
    parent::__construct();
    $this->ScanVehicleLastSeenTimes()->MarkVehiclesAsSold();
  }

  public function Output() {
    // If the page didn't die, we know it succeeded
    return json_encode(['sales'=>sizeof($this->newSales)]);
  }

  private function ScanVehicleLastSeenTimes() {
    $oneWeekAgo = time() - 60 * 60 * 24 * 7;
    $thresholdIndex = $this->CronJobDB->Fetch('Workers', 'WorkerId,WorkerIndex', ['WorkerRef'=>'Sales.Inventory.CarMax.Threshold']);
    $thresholdTimestamp = ($thresholdIndex) ? $thresholdIndex['WorkerIndex'] : 0;
    $this->thresholdWorkerId = ( $thresholdIndex ) ? $thresholdIndex['WorkerId'] : 0;

    if ( !$thresholdIndex )
      $this->CronJobDB->Create('Workers', [
        'WorkerRef'=>'Sales.Inventory.CarMax.Threshold',
        'WorkerIndex'=>0,
        'Modified' => time()
      ]);

    $this->newSales = $this->CarMaxPDO->Query("
      SELECT
        Vehicles.Vin
      FROM
        Vehicles
      LEFT JOIN
        Sales
      ON
        Vehicles.Vin = Sales.Vin
      WHERE
        Sales.Vin IS NULL
          AND
        Vehicles.LastSeen <= $oneWeekAgo
          AND
        Vehicles.LastSeen >= $thresholdTimestamp
    ")->FetchAll();
    return $this;
  }

  private function MarkVehiclesAsSold() {
    foreach($this->newSales as $soldVehicle)
      $this->CarMaxDB->Create('Sales', ['Vin'=>$soldVehicle['Vin'],'Created'=>time()]);
    $this->CronJobDB->Update('Workers', [
      'WorkerIndex' => time(),
      'Modified' => time()
    ], ['WorkerId'=>$this->thresholdWorkerId]);
    return $this;
  }

  function __destruct() {
    if ( $this->thresholdWorkerId )
      $this->CronJobDB->Create('Output', [
        'WorkerId'=>$this->thresholdWorkerId,
        'Output'=>$this->Output(),
        'Runtime'=>elapsed_execution_time(),
        'Created'=>time()
      ]);
  }
} // Conclude Class CronJob/Sales
?>
