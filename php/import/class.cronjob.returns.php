<?php
namespace CronJob;
class Returns extends \CronJob {
  private $newReturns;
  private $thresholdWorkerId;
  function __construct() {
    parent::__construct();
    $this->ScanVehicleSaleTimes()->MarkVehiclesAsReturned();
  }

  public function Output() {
    // If the page didn't die, we know it succeeded
    return json_encode(['returns'=>sizeof($this->newReturns)]); // typecasting to string for prettiness - I'm sorry :(
  }

  private function ScanVehicleSaleTimes() {
    $this->newReturns = $this->CarMaxPDO->Query("
      SELECT
        Sales.SaleId
      FROM
        Vehicles
      LEFT OUTER JOIN
        Sales
      ON
        Vehicles.Vin = Sales.Vin
          AND
        Vehicles.LastSeen > Sales.Created
      LEFT OUTER JOIN
        Returns
      ON
        Returns.SaleId = Sales.SaleId
      WHERE
        Sales.Vin IS NOT NULL
          AND
        Returns.SaleId IS NULL
    ")->FetchAll();
    return $this;
  }

  private function MarkVehiclesAsReturned() {
    foreach($this->newReturns as $return)
      $this->CarMaxDB->Create('Returns', [
        'SaleId'=>$return['SaleId'],
        'Created'=>time()
      ]);
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
