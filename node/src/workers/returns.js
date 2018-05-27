/**************************************************************************************************************
 * Worker process:
 * 1. Scan sales for vehicles who's Vehicles.LastSeen time is greater than their Sales.Created time
 * 2. Remove sales records and insert return record for all vehicles from #1
 **************************************************************************************************************/

'use strict';

const MySql = require('./../../util/mysql');
const timestamp = () => Math.floor(Date.now() / 1000);

const CarMaxDB = new MySql('DealerData_CarMax');

/**************************************************************************************************************
 * conflictingVehicles() - Returns a list of vehicles who's LastSeen time is greater than their sale time
 * @return Array - array of absent vehicles
 **************************************************************************************************************/
const conflictingVehicles = async () => {
  return await CarMaxDB.query(`
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
  `);
}


/**************************************************************************************************************
 * markVehiclesAsReturned() - Marks the supplied vehicles as returned in the db
 * @param salesList - Array of sold vehicles that have been returned
 * @return bool - true if all returns were successful, false/err otherwise
 **************************************************************************************************************/
const markVehiclesAsReturned = async (salesList) => {
  if ( typeof salesList != typeof [] )  // no vehicles have been returned
    return true;
  salesList.map(soldVehicle => {
    CarMaxDB.insert('Returns', {
      SaleId: soldVehicle.SaleId,
      Created: timestamp()
    });
  });
  return true;
}



/**************************************************************************************************************
 * processReturns() - Main worker that calls the other two methods
 * @return bool - true
 **************************************************************************************************************/
const processReturns = async () => await markVehiclesAsReturned(await conflictingVehicles());




module.exports = {
  exec: processReturns
};
