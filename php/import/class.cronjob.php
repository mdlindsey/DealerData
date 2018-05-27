<?php

class CronJob {
  protected $CronJobDB, $CronJobPDO, $CarMaxDB;
  function __construct() {
    $this->CarMaxDB = new \DB\MySQL('DealerData_CarMax');
    $this->CarMaxPDO = new \DB\MySQL\PDO('DealerData_CarMax');
    $this->CronJobDB = new \DB\MySQL('DealerData_CronJob');
    $this->CronJobPDO = new \DB\MySQL\PDO('DealerData_CronJob');
  }
  protected function Error($error) {
    $this->CronJobDB->Create('Errors', [
      'Worker' => 'Scraper.Inventory.CarMax',
      'Error' => $error,
      'Created' => time()
    ]);
    die(json_encode(['error'=>$error]));
  }
} // Conclude Class CronJob




?>
