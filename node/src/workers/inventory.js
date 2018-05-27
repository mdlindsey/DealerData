/**************************************************************************************************************
 * Worker process:
 * 1. Scrape inventory
 *   1-1. Get next index
 *   1-2. Fetch data from CarMax API
 *   1-3. If data is blank, move to dealership and reset index to 0
 *   1-4. If data is valid, save the resulting data and increment the index by 1
 **************************************************************************************************************/

'use strict';

const url = require('./../../util/url');
const MySql = require('./../../util/mysql');
const isJson = require('./../../util/is-json');
const timestamp = () => Math.floor(Date.now() / 1000);

const CarMaxDB = new MySql('DealerData_CarMax');
const WorkerDB = new MySql('DealerData_CronJob');


/**************************************************************************************************************
 * nextDealership() - Returns the zip code {zip} and store id {id} for the most outdated dealership
 * @return object - {zip: zipCode, id: storeId}
 **************************************************************************************************************/
const nextDealership = async () => {
  let dealership = await CarMaxDB.query('SELECT StoreId,Zip FROM Dealerships ORDER BY Modified ASC LIMIT 1');
  if ( !dealership )
    throw new Error('no dealerships found');
  return {zip: dealership[0].Zip, id: dealership[0].StoreId};
}

/**************************************************************************************************************
 * nextPageNumber() - Returns the next page number for the most outdated dealership
 * @param defaultValue - If no worker page index is found, this default value will be returned
 * @return int - 0:infinite
 **************************************************************************************************************/
const nextPageNumber = async (defaultValue=1) => {
  let workerPage = await WorkerDB.query("SELECT WorkerIndex FROM Workers WHERE WorkerRef = 'Scraper.Inventory.CarMax.Page' LIMIT 1");
  if ( !workerPage )
    return defaultValue;
  return workerPage[0].WorkerIndex;
}


/**************************************************************************************************************
 * carmaxUrl() - Returns the CarMax.com URL used to fetch new inventory data
 * @return String - https://api.carmax.com?...
 **************************************************************************************************************/
const carmaxUrl = async () => {

  let page = await nextPageNumber();
  let dealership = await nextDealership();

  let perPage = 50;
  let startIndex = Math.max(0, page-1) * perPage;

  let urlAttrs = {
    Zip: dealership.zip,
    Distance: 10,
    Page: page,
    PerPage: perPage,
    StartIndex: startIndex,
    SortKey: 1,
    Refinements: '',
    ExposedDimensions: '249+250+1001+1000+265+999+772',
    Sorts: '0+14+6+9',
    ExposedCategories: '249+250+1001+1000+265+999+772',
    platform: 'carmax.com',
    apikey: 'adfb3ba2-b212-411e-89e1-35adab91b600'
  };

  let urlVars = [];
  for(let attrName in urlAttrs)
    urlVars.push(attrName + '=' + urlAttrs[attrName]);

  let url = 'https://api.carmax.com/v1/api/vehicles?' + urlVars.join('&');
  return url;
}

/**************************************************************************************************************
 * carmaxInventoryJson() - Returns JSON data with vehicle details used to track inventory
 * @return int - 0:infinite
 **************************************************************************************************************/
const carmaxInventoryJson = async () => {
  let apiUrl = await carmaxUrl();
  let json = await url.get(apiUrl);
  if ( !isJson(json) )
    throw new Error('api returned non-json result');
  let data = JSON.parse(json);
  if ( typeof data.Results != typeof [] )
    return false;
  return data.Results;
}

/**************************************************************************************************************
 * incrementWorkerIndex() - Increments the worker page by 1 (defaults to 1+1 aka 2 if it doesn't already exist)
 * @return bool - true
 **************************************************************************************************************/
const incrementWorkerIndex = async () => {
  let pageNumber = await nextPageNumber();
  if ( !pageNumber )
    WorkerDB.insert('Workers', {
      WorkerRef: 'Scraper.Inventory.CarMax.Page',
      WorkerIndex: 2,
      Modified: timestamp()
    });
  else
    WorkerDB.update('Workers', {
      WorkerIndex: Number(pageNumber) + 1,
      Modified: timestamp()
    }, "WorkerRef = 'Scraper.Inventory.CarMax.Page'");
  return true;
}

/**************************************************************************************************************
 * resetWorkerIndex() - Resets the page worker index to 0 and marks the most oudated dealership as updated
 * @return bool - true
 **************************************************************************************************************/
const resetWorkerIndex = async () => {
  let dealership = await nextDealership();
  await CarMaxDB.update('Dealerships', {
    Modified: timestamp()
  }, 'StoreId = ' + dealership.id);
  await WorkerDB.update('Workers', {
    WorkerIndex: 0,
    Modified: timestamp()
  }, "WorkerRef = 'Scraper.Inventory.Carmax.Page'");
  return true;
}

/**************************************************************************************************************
 * convertMiles() - Turns 10k into 10000
 * @param miles - String representation of mileage (eg: 100k)
 * @return int - 0:infinite
 **************************************************************************************************************/
const convertMiles = (miles) => Number(miles.toString().toLowerCase().replace('k', '000'));

/**************************************************************************************************************
 * parseVehicle() - Takes a given vehicle's data, saves it if it doesn't exist, or updates it if it does
 * @return bool - true
 **************************************************************************************************************/
const parseVehicle = async (vehicleData) => {
  let savedFields = ['Vin', 'StoreId', 'FirstSeen', 'LastSeen', 'Price', 'Year', 'Make', 'Model', 'Miles', 'Cylinders', 'EngineSize', 'DriveTrain', 'Transmission', 'InteriorColor', 'ExteriorColor', 'MpgCity', 'MpgHighway', 'NewTireCount', 'AverageRating', 'NumberOfReviews', 'StockNumber', 'Highlights'];
  for(let attrName in vehicleData) {
    if ( savedFields.indexOf(attrName) < 0 )
      delete vehicleData[attrName];
  }

  let formattedVehicleData = {
    ...vehicleData,
    LastSeen: timestamp(),
    Miles: convertMiles(vehicleData.Miles)
  };
  let storedVehicleData = await CarMaxDB.query("SELECT * FROM Vehicles WHERE Vin = '"+vehicleData.Vin+"'");
  if ( !storedVehicleData || storedVehicleData[0] === undefined )
    CarMaxDB.insert('Vehicles', {
      ...formattedVehicleData,
      FirstSeen: timestamp()
    });
  else
    updateVehicle(formattedVehicleData, storedVehicleData[0]);

  // uncomment if you want visual validation of the task
  //console.log('Completed parsing vehicle '+vehicleData.Vin);
  return true;
}

/**************************************************************************************************************
 * updateVehicle() - Tracks moves if they occur and updates the vehicle row in the db
 * @return bool - true
 **************************************************************************************************************/
const updateVehicle = async (newVehicleData, storedVehicleData) => {
  if ( newVehicleData.StoreId != storedVehicleData.StoreId )
    CarMaxDB.insert('Moves', {
      Vin: newVehicleData.Vin,
      Created: timestamp(),
      OldStoreId: storedVehicleData.StoreId,
      NewStoreId: newVehicleData.StoreId
    });

  let combinedVehicleData = {...storedVehicleData, ...newVehicleData, FirstSeen: storedVehicleData.FirstSeen, Miles: storedVehicleData.Miles};
  CarMaxDB.update('Vehicles', combinedVehicleData, "Vin = '"+newVehicleData.Vin+"'");
  return true;
}

/**************************************************************************************************************
 * refreshInventory() - Performs all tasks related to refreshing the inventory (aka scraping new data)
 * @return bool - true
 **************************************************************************************************************/
const refreshInventory = async () => {
  let inventoryJson = await carmaxInventoryJson();
  if ( !inventoryJson || !inventoryJson.length )
    return await resetWorkerIndex();

  await incrementWorkerIndex();
  inventoryJson.map( vehicle => parseVehicle(vehicle) );
  return true;
}

const worker = {
  url: carmaxUrl,
  inventory: carmaxInventoryJson,
  page: nextPageNumber,
  dealership: nextDealership,
  increment: incrementWorkerIndex,
  reset: resetWorkerIndex,
  // main worker:
  exec: refreshInventory
};

module.exports = worker;
