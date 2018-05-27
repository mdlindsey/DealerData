<?php

/*
  Error codes:
  A1: DB Offline
  A2: DB Query Failure
  A3: CarMax DB Offline
  A4: CarMax DB Query Failure
*/

class API {
  private $requestId;
  protected $apiDB, $CarMaxDB, $CarMaxPDO;
  protected $input, $output, $buffer, $log, $runtime;

  private $runtimeKey = 'runtime'; // leave blank to disable

  function __construct() {
    $this->apiDB = new DB\MySQL('DealerData_API');
    $this->CarMaxDB = new DB\MySQL('DealerData_CarMax');
    $this->CarMaxPDO = new DB\MySQL\PDO('DealerData_CarMax');
  }

  public function Output() {
    $this->EvalInput()->LogRequest()->GenerateOutput();
    return json_encode($this->output);
  }

  protected function EvalInput() {
    $this->input = array_merge($_GET, $_POST);
    return $this;
  }

  // This is where all the magic happens!
  private function GenerateOutput() {
    $this->output = [];
    $this->CarMax()->Compile();
    $this->LogOutput();
    return $this;
  }

  protected function LogRequest() {
    $this->requestId = $this->apiDB->Create('Requests', [
      'Ip' => $_SERVER['REMOTE_ADDR'],
      'Url' => urldecode($_SERVER['REQUEST_URI']),
      'Input' => json_encode($this->input),
      'Created' => time()
    ]);
    return $this;
  }

  protected function LogOutput() {
    $this->apiDB->Create('Output', [
      'RequestId' => $this->requestId,
      'Output' => json_encode($this->output),
      'Runtime' => $this->runtime,
    ]);
    return $this;
  }

  protected function LogError($error) {
    $this->apiDB->Create('Errors', [
      'RequestId' => $this->requestId,
      'Error' => $error
    ]);
    return $this;
  }

  protected function Error($error) {
    $this->LogError($error);
    die(json_encode([
      'error' => $error
    ]));
  }

  private function Buffer($data) {
    $this->buffer = $data;
    return $this;
  }

  private function Compile() {
    $this->output = array_merge($this->output, $this->buffer);
    $this->runtime = elapsed_execution_time();
    if ( $this->runtimeKey || $this->runtimeKey === 0 )
      $this->output[$this->runtimeKey] = $this->runtime;
    unset($this->buffer);
    return $this;
  }

  private function CarMax() {
    $carmax = new \API\CarMax($this->input);
    $this->Buffer($carmax->Output());
    return $this;
  }

  function __destruct() {
    unset($this->output);
  }

} // Conclude Class API



?>
