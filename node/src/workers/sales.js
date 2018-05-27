/**************************************************************************************************************
 * Worker process:
 * 1. Mark sold vehicles as sales
 *   1-1. Scan all vehicle last seen times (greater than the last worker threshold)
 *   1-2. If LastSeen time is less than current time minus return period (7 days) then it has sold
 **************************************************************************************************************/

'use strict';

const MySql = require('./../../util/mysql');
const timestamp = () => Math.floor(Date.now() / 1000);

const CarMaxDB = new MySql('DealerData_CarMax');
const WorkerDB = new MySql('DealerData_CronJob');

/**************************************************************************************************************
 * absentVehicles() - Returns a list of vehicles that have not been seen in more time than the return period
 * @param days - Number of days to use for the return period/threshold (default is 7)
 * @return Array - array of absent vehicles
 **************************************************************************************************************/
const absentVehicles = async (days=7) => {
  let upperThreshold = timestamp() - days * 86400; // seconds in a day
  let getLastThreshold = await WorkerDB.query("SELECT WorkerIndex FROM Workers WHERE WorkerRef = 'Sales.Inventory.CarMax.Threshold'");
  let lowerThreshold = Number(( !getLastThreshold || !getLastThreshold.length ) ? 0 : getLastThreshold[0].WorkerIndex);

  if ( !lowerThreshold ) // assuming it wasn't running in 1970 we can use a 0 timestamp to denote db failure
    WorkerDB.insert('Workers', {
      WorkerRef: 'Sales.Inventory.CarMax.Threshold',
      WorkerIndex: upperThreshold,
      Modified: timestamp()
    });

  let absentVehicles = await CarMaxDB.query(`
    SELECT
      Vehicles.Vin, Vehicles.LastSeen
    FROM
      Vehicles
    LEFT JOIN
      Sales
    ON
      Vehicles.Vin = Sales.Vin
    WHERE
      Sales.Vin IS NULL
        AND
      Vehicles.LastSeen <= `+upperThreshold+`
        AND
      Vehicles.LastSeen >= `+lowerThreshold
  );

  if ( !absentVehicles || !absentVehicles.length )
    return false;

  return absentVehicles;
}

/**************************************************************************************************************
 * markVehiclesAsSold() -  Marks the supplied vehicle array as sold
 * @param vehicleList - Array of vehicles to mark as sold
 * @return bool - true if successful, false/err if a sale failed to insert
 **************************************************************************************************************/
const markVehiclesAsSold = async (vehicleList) => {
  if ( typeof vehicleList != typeof [] )  // no vehicles have been sold
    return true;
  // if running at multiple instances, should do a redundancy check here to make sure it hasn't been
  // marked sold in the amount of time it took to fetch and loop, but not necessary on this deployment
  let newSalesThreshold = 0;
  vehicleList.map( vehicle => {
    newSalesThreshold = Math.max(newSalesThreshold, Number(vehicle.LastSeen));
    let insert = CarMaxDB.insert('Sales', {
      Vin: vehicle.Vin,
      Created: timestamp()
    });

    if ( !insert ) {
      throw new Error('failed to log new sale');
      return false;
    }

    // Nice to have some validation right? Uncomment this if you want to see it in action
    //console.log('VIN '+vehicle.Vin+' sold');
  });

  // update worker threshold
  WorkerDB.update('Workers', {
    WorkerIndex: newSalesThreshold,
    Modified: timestamp()
  }, "WorkerRef = 'Sales.Inventory.CarMax.Threshold'");

  return true;
}

const findNewSales = async () => await markVehiclesAsSold(await absentVehicles());

module.exports = {
  exec: findNewSales
};
