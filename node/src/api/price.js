'use strict';

const ucFirst = require('ucfirst');
const MySql = require('./../../util/mysql');
const CarMaxDB = new MySql('DealerData_CarMax');


// Originally planned on using ??/? for identifiers/values but mysqljs npm package
// does not support forgoing escaping of computed columns (eg: CAST Col AS SIGNED)
// - - -
// Manual .escape() could be wrapped and avoided but was left to emphasize importance
// of escaping any user-contributed value
/**************************************************************************************************************
 * PriceChecker() - Returns min/avg/max price and next field options if applicable, given the vehicle criteria
 * @param req - Express req object
 * @param res - Express res object
 * @return object - {options: [], min: int, avg: int, max: int}
 **************************************************************************************************************/
module.exports = async (req, res) => {
  // abbr req.body as POST
  let POST = req.body;
  
  // Again, using {SELECTIONS} instead of ?? for lack of escape omission on computed cols
  let baseQuery = `
      SELECT
        {SELECTIONS}
      FROM
        Vehicles
      LEFT JOIN Sales ON Sales.Vin = Vehicles.Vin
      LEFT JOIN Returns ON Returns.SaleId = Sales.SaleId
      WHERE
    `;

  // For this purpose, we only want sold vehicles that were not returned, so we can start off with that criteria
  let wheres = ['Sales.Vin IS NOT NULL', 'Returns.SaleId IS NULL'];

  // Simple fields (year, make, model) could be added dynamically, but this reads easier since its only 3 items
  if ( POST.year !== undefined )
    wheres.push('Year = ' + Number(POST.year));
  if ( POST.make !== undefined )
    wheres.push('Make = ' + CarMaxDB.escape(POST.make));
  if ( POST.model !== undefined )
    wheres.push('Model = ' + CarMaxDB.escape(POST.model));

  if ( POST.engine !== undefined ) {
    let engineParts = POST.engine.split(' ');
    if ( engineParts.length ) {
      let cylinders = Number(engineParts[1].replace(/[^0-9]/g, ''));
      wheres.push('EngineSize = ' + CarMaxDB.escape(engineParts[0]), 'Cylinders = ' + CarMaxDB.escape(cylinders));
    }
  }

  // The front-end form doesn't currently support mileage, but this is included to demo how range values
  // were allowed on the year, mileage, and price fields on the original DealerData.org deployment.
  if ( POST.mileage !== undefined ) {
    let splitMileageAsRange = POST.mileage.split('-');
    let mileageValues = ( !splitMileageAsRange.length )
      ? {min: POST.mileage, max: POST.mileage}
      : {min: splitMileageAsRange[0], max: splitMileageAsRange[1]};

    wheres.push('Miles >= ' + Number(mileageValues.min), 'Miles <= ' + Number(mileageValues.max));
  }

  // Select the min/avg/max price for this criteria
  let pricingQuerySelections = [
    'CAST(ROUND(MIN(Price)) AS UNSIGNED) AS min',
    'CAST(ROUND(AVG(Price)) AS UNSIGNED) AS avg',
    'CAST(ROUND(MAX(Price)) AS UNSIGNED) AS max',
  ];

  // Replace the {SELECTIONS} placeholder and execute the resulting query
  let pricingQuery = baseQuery.replace('{SELECTIONS}', pricingQuerySelections.join(', ')) + wheres.join(' AND ');
  let pricingQueryResults = await CarMaxDB.query(pricingQuery);

  if ( !pricingQueryResults || !pricingQueryResults.length )
    throw new Error('no pricing data found with that criteria');

  // only assign options if POST.get is set
  let options = [];
  if ( POST.get !== undefined ) {
    let optionsDbCol = ucFirst(POST.get);
    // unless the next field is `engine`, it will follow the same select structure
    let optionsQuerySelection = ( POST.get.toLowerCase() == 'engine' )
      ? 'DISTINCT CONCAT(EngineSize, " V", Cylinders) AS engine'
      : 'DISTINCT ' + optionsDbCol + ' AS ' + POST.get.toLowerCase();

    // replace the {SELECTIONS} placeholder and execute the resulting query
    let optionsQuery = baseQuery.replace('{SELECTIONS}', optionsQuerySelection) + wheres.join(' AND ') + ' ORDER BY ' + optionsDbCol + ' ASC';
    let optionsQueryResults = await CarMaxDB.query(optionsQuery);

    // If POST.get was set but no results are found, catch this error instance
    if ( !optionsQueryResults || !optionsQueryResults.length )
      throw new Error('no options found with that criteria');

    // Add to options array
    optionsQueryResults.map( result => options.push(result[POST.get]) );
  } // end if ( POST.get !== undefined )

  let finalOutput = {...pricingQueryResults[0], options: options};

  // If you need some debug logging this may be helpful
  //console.log('PriceChecker Input:');
  //console.log(POST);
  //console.log('PriceChecker Output:');
  //console.log(finalOutput);

  res.end(JSON.stringify({
    error: null,
    output: finalOutput
  }));

};
