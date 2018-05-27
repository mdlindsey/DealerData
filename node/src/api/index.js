'use strict';
const bodyParser = require('body-parser'); // simplifies support for POST data
const priceChecker = require('./price');
module.exports = {
  http: config => {
    const app = require('express')();
    app.use(bodyParser.json()); // support json encoded bodies
    app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

    // Add headers
    app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', config.url.client);
      res.setHeader('Access-Control-Allow-Credentials', true); // not used, but helpful if you want to maintain sessions/cookies
      next(); // go to next middleware if applicable
    });

    // Begin listening
    app.listen(config.port.http, () => {
      console.log('App listening on port %d!', config.port.http); // Validation logging
    });

    app.get('/', (req, res) => {
      res.end(JSON.stringify({error: 'invalid request', output: null})); // static output for root requests
    });


    /**************************************************************************************************************
     * API requests
     **************************************************************************************************************/
    app.post('/get/price', (req, res) => {
      priceChecker(req, res); // res.end() is performed inside priceChecker
    });
    // Other features such as most-popular, most-unpopular, local-favorite(zip), and more are
    // present in the PHP API on DealerData.org but weren't implemented in this Node version yet.

  }
};
