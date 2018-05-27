/**************************************************************************************************************
 * @file index.js
 * @author Dan Lindsey
 * @version 0.1.0
 * @description NodeJS back-end demo for DealerData.org (adapted from PHP)
 **************************************************************************************************************/
'use strict';
/**************************************************************************************************************
 * 1. Import
 **************************************************************************************************************/
const config = require('./src/config'); // server config settings (port, domain, etc)
const debug = require('./src/debug'); // debug options (uncaught promises, etc)
const api = require('./src/api'); // api wrapper to handle express/http requests
const workers = require('./src/workers');
/**************************************************************************************************************
 * 2. Setup
 **************************************************************************************************************/
// Log all uncaught promises to the console
debug.promise();
// Setup express
const app = api.http(config);
/**************************************************************************************************************
 * 3. High-level wrappers
 **************************************************************************************************************/
setInterval(workers.inventory, 30000); // 30s
setInterval(workers.sales, 60000); // 60s
setInterval(workers.returns, 120000); // 120s
