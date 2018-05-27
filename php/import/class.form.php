<?php

class Form {
  private $db, $pdo, $output;
  function __construct() {
    // init db
    $this->db = new DB\MySQL;
    $this->pdo = new DB\MySQL\PDO;
    // init output data array
    $this->output = [];
  }

  public function Error($msg, $code=false) {
    $this->output['!'][] = ($code === false ? '' : "[$code]") . $msg;
    return $this;
  }

  public function RequireInputs($inputList, $fieldset = false) {
    if ( !$fieldset )
      $fieldset = $_POST;
    foreach($inputList as $field => $validators) {
      if ( !isset($fieldset[$field]) ) {
        $this->Error($field . ' not set');
        return false;
      }
      foreach($validators as $validate => $errorMsg) {
        $localized = preg_replace('#^\->#', '', $validate);
        $expression = ($localized == $validate) ? $validate($fieldset[$field]) : $this->$localized($fieldset[$field]);
        if ( !$expression ) {
          $this->Error($errorMsg);
          return false;
        }
      }
    }
    return true;
  }

  private function InspectInput($input) {
    if ( !$input )
      return false;
    return true;
  }

  public function SID() {
    $this->output['sid'] = session_id();
    return $this;
  }

  public function ClientId($clientEmail, $returnImmediately=false) {
    // check for email
    $existing = $this->db->Fetch('clients', 'id', ['email'=>$clientEmail]);
    $clientId = $existing ? $existing['id'] : $this->db->Create('clients', ['email'=>$clientEmail, 'created'=>time()]);
    $this->output['clientId'] = $clientId;
    if ( $returnImmediately )
      return $clientId;
    return $this;
  }

  public function Output() {
    return $this->output;
  }


  private function KeyGen() {
    return session_id();
    $time = time() + microtime();
    $char_int = compress_int( $time * $time );

    $encoded = microtime();
    for($i = 0; $i < 5; $i++)
      $encoded .= microtime();

    $encoded = encode_string($encoded);
    $encoded .= $encoded .= $encoded;

    $key_length = 64;
    $encoded_start = 8;
    $encoded_length = $key_length - strlen($char_int);
    $encoded_piece = substr($encoded, $encoded_start, $encoded_length);

    $key = $encoded_piece . $char_int;

    return $key;
  }
  function __destruct()  {}
}


?>
