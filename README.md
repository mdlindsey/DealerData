# DealerData

Demo available at [CarMax.io](https://carmax.io/).

This package includes:
- Data collection engine for gathering CarMax inventory data
- Database setup queries for incoming inventory data
- Node back-end to accept HTTP requests and run system workers
- React front-end with price range visualization tool
- (Optional) Reverse proxy virtual host setup for Linux + Apache + Node stacks
- (Optional) Alternate OOP-based PHP back-end for those who aren't running Node



## How it works

In essence, the entire system process is quite simple.

1. Collect inventory data from CarMax
2. Sanitize and sort data from CarMax
3. Compare and store data from CarMax
4. Routine data check-ups to detect sales

### Collecting inventory data

CarMax grants access to their semi-public API through `api.carmax.com`, which this software utilizes for its data gathering.

### Sanitizing and sorting data

In the case of this software, we alter the storage method for the `Miles` column. Originally, mileage is stored in the database as `100k` or `10k` and so forth. To allow for easier aggregate calculations, this software stores them as their integer counterpart, `100000` or `10000` respectively.

This implementation forgoes certain available fields, but check the raw data returned from `api.carmax.com` and alter your data storage as needed.

### Comparing and storing data

When new inventory data is collected, each resulting vehicle is examined in individually. Here is a basic decision list that is used.

- Is this vehicle is not in the database, insert it and return
- If this vehicle already exists in `Vehicles`, compare the `StoreId` of this result and the previously stored record to detect moves
- If this vehicle already exists in `Vehicles` and exists in `Sales`, remove the sales record and mark it in `Returns`

### Routine data check-ups

To detect sales, CarMax's return period of 7 days is taken into consideration. Once a vehicle has stopped appearing in CarMax's inventory for 7 days, it has the potential to be marked as sold.

If for some reason the vehicle reappears in CarMax's inventory, the sales record is removed and a vehicle return is logged instead.



## Installation

Setup is as easy as running a couple queries and changing a few variables.

### Prerequisites

- `MySQL v5.7+`
- `NodeJS v7.6+`
- `ReactJS v16.0+`

### MySQL

Run queries in `mysql` directory to create database(s) and tables

```
mysql> use DealerData_CarMax;
mysql> source DealerData_CarMax.sql;
mysql> use DealerData_CronJob;
mysql> source DealerData_CronJob.sql;
```

The only table with data is `DealerData_CarMax.Dealerships` which contains all current CarMax franchise locations so your local installation of the app has the data collection points necessary to begin.

### Node

1. Set `ORIGIN` in `node/src/config.js` to the same value as `this.host` in `react/App.js`
2. Set `PORT` in `node/index.js` (optional)

### React

1. Extract the `react` folder to a location of your choosing, we'll use `c:/dev`
	`cd c:/dev`
2. Use `npm install` to install all applicable dependencies
	`npm install`
3. Use `npm start` to initiate the test server for your new React app
	`npm start`
4. Change `host` in `react/App.js` to your domain
	`this.host = https://my-app-domain.com`
5. Use `npm run build` to create an optimized build for your front-end app
	`npm run build`


### PHP (deprecated)

It is recommended to run the newer Node version of this software, but the PHP version is still functional if you need it instead.

1. Import files from `import` - originally used [Able](https://sisyn.com/library/able/docs)
2. Change MySQL settings in `php/import/config.mysql.php`
3. Use the default path (`/`) to access the HTTP(S) API
4. Run `cron/inventory`, `cron/sales`, and `cron/returns` repeatedly

If using PHP, the `ProxyRequests` and `ProxyPass` settings in the `vhost` configuration are no longer needed.

### V-Host Proxy Setup

Feel free to use this `vhost` boilerplate if you're running on Apache (created on Ubuntu 16.04).

```
# domain: api.example.com
# public: /home/user/apps/example.com/api

<VirtualHost *:80>
  # Admin email, Server Name (domain name), and any aliases
  ServerAdmin admin@example.com
  ServerName  api.example.com
  ServerAlias www.api.example.com

  # Index file and Document Root (where the public files are located)
  DirectoryIndex index.php index.html
  DocumentRoot /home/user/apps/example.com/api

  # Setup proxy for Node server
  ProxyRequests on
  ProxyPass / http://localhost:8080/
  # If you only want to forward one directory to NodeJS, use this
  # ProxyPass /api http://localhost:8080/

  # Log file locatapins
  LogLevel warn
  ErrorLog  /home/user/apps/carmax.io/log/error.log
  CustomLog /home/user/apps/carmax.io/log/access.log combined
</VirtualHost>
```



## Usage

### Node API

Files available in `node/src/api`

#### Users

- `POST /get/price` - used to perform `PriceCheck.exec({...formData})`

#### Workers

- `GET /worker/inventory` - used to perform `Inventory.exec()`
- `GET /worker/sales` - used to perform `Sales.exec()`
- `GET /worker/returns` - used to perform `Returns.exec()`

#### Sales worker

File located in `node/src/workers/sales.js`

##### Main worker

- `exec()` - main worker used to log new sales

#### Returns worker

File located in `node/src/workers/returns.js`

##### Main worker

- `exec()` - main worker used to log new returns

#### Inventory worker

File located in `node/src/workers/inventory.js`

##### Main worker

- `exec()` - main worker used to refresh inventory data

##### Dev methods

- `url()` - gets the next applicable URL for the CarMax API
- `inventory()` - uses url() to fetch JSON from the CarMax API
- `page()` - returns the next worker page number for the CarMax API
- `dealership()` - returns the next dealership zip + id for the CarMax API
- `increment()` - increments the worker page for the CarMax API
- `reset()` - resets the worker page and dealership (if applicable) for the CarMax API



### React UI

#### File structure

- `react/API.js` - contains wrapper for posting data to the Node server
- `react/App.js` - contains config settings and high-level app logic and imports
- `react/App/Page.js`- basic template for all default pages to follow
- `react/App/Pages/PriceCheck` - main page with the price visualization tool

#### Icon packages

Only `icomoon` and `font-awesome-4` are included by default, but there are other icon packages ready to be used after a simple inclusion; otherwise they stay unused.

- `react/src/__gfx__/fonts/icomoon`

- `react/src/__gfx__/fonts/elegants-icons`
- `react/src/__gfx__/fonts/font-awesome-4`
- `react/src/__gfx__/fonts/font-awesome-5`

- `react/src/__gfx__/fonts/simple-line-icons`

#### Other tools

- `react/import/NewWindow` - component to prevent `target="_blank"` warnings
- `react/import/AnchorScroll` - component for smoothly scroll to an anchor on the page
- `xhrFields: { withCredentials: true }` - unused but available in `react/API.js` and `node/index.js` to allow the client to maintain cookies/sessions on an alternative domain via ajax requests



## Built With

* [MySQL](https://www.mysql.com/) - Database used
* [NodeJS](https://nodejs.org/) - Server-side environment
* [ReactJS](https://reactjs.org/) - Front-end framework



## Authors

* **Dan Lindsey** - *Initial work* - [Adom.co](https://adom.co)



## License

This project is licensed under the GPLv3 License - see the [LICENSE.md](LICENSE.md) file for details.
