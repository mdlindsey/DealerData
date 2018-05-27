<?php

namespace API;
class CarMax extends \API {
  function __construct($input) {
    parent::__construct();
    $this->input = $input;
  }

  public function Output() {
    $this->Fetch();
    return $this->output;
  }

  private function Fetch() {
    $baseQuery = "
      SELECT
        {SELECTIONS}
      FROM
        Vehicles
      LEFT JOIN Sales ON Sales.Vin = Vehicles.Vin
      LEFT JOIN Returns ON Returns.SaleId = Sales.SaleId
      WHERE
    ";

    $values = [];
    $wheres = ['Sales.Vin IS NOT NULL', 'Returns.SaleId IS NULL'];
    if ( isset($this->input['year']) ) {
      $wheres[] = 'Year = :year';
      $values['year'] = $this->input['year'];
    }
    if ( isset($this->input['make']) ) {
      $wheres[] = 'Make = :make';
      $values['make'] = $this->input['make'];
    }
    if ( isset($this->input['model']) ) {
      $wheres[] = 'Model = :model';
      $values['model'] = $this->input['model'];
    }
    if ( isset($this->input['mileage']) ) {
      $wheres[] = 'Miles >= :minMiles';
      $wheres[] = 'Miles <= :maxMiles';
      $splitAsRange = explode('-', $this->input['mileage']);
      if ( sizeof($splitAsRange) != 2 ) {
        $values['minMiles'] = $this->input['mileage'];
        $values['maxMiles'] = $this->input['mileage'];
      } else {
        list($values['minMiles'], $values['maxMiles']) = explode('-', $this->input['mileage']);
      }
    }
    if ( isset($this->input['engine']) ) {
      $wheres[] = 'EngineSize = :engineSize';
      $wheres[] = 'Cylinders = :engineCylinders';
      list($engineSize, $engineCylinders) = explode(' ', $this->input['engine']);
      $values['engineSize'] = trim($engineSize);
      $values['engineCylinders'] = (int)preg_replace('#^v#i', '', $engineCylinders);
    }

    $select = [
      'CAST(ROUND(MIN(Price)) AS UNSIGNED) AS min',
      'CAST(ROUND(AVG(Price)) AS UNSIGNED) AS avg',
      'CAST(ROUND(MAX(Price)) AS UNSIGNED) AS max',
    ];
    $pricingQuery = str_replace('{SELECTIONS}', join(',', $select), $baseQuery) . join (' AND ', $wheres);
    $prep = $this->CarMaxPDO->Prepare($pricingQuery);
    $prep->Execute($values);
    $pricingOutput = $prep->Fetch();

    $fieldOptionsOutput = [];
    if ( isset($this->input['get']) ) {
      switch($this->input['get']) {
        default:
        case 'price' :
          $select = [ 'DISTINCT ' . ucwords($this->input['get']) . ' AS ' . strtolower($this->input['get']) ];
          break;
        case 'engine':
          $select = [ 'DISTINCT CONCAT(EngineSize, " V", Cylinders) AS engine' ];
          break;
      }
      $fieldOptionsQuery = str_replace('{SELECTIONS}', join(',', $select), $baseQuery) . join (' AND ', $wheres);
      $prep = $this->CarMaxPDO->Prepare($fieldOptionsQuery);
      $prep->Execute($values);
      $fieldOptionsOutput = $prep->FetchAll();
    }

    $this->output = array_merge($pricingOutput, $fieldOptionsOutput);
    return $this;
  }

  function __destruct() {
    parent::__destruct();
  }

} // Conclude Class API



?>
