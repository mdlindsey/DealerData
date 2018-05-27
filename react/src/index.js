import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-g-analytics';
// Import BrowserRouter from react-g-analytics instead of react-router-dom so that Google Analytics functions as expected

import '__gfx__/fonts/icomoon/style.css';
import '__gfx__/fonts/font-awesome-v4/style.css';

import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App';
import LocalStorageCacheServiceWorker from './__sys__/LocalStorageCacheServiceWorker';

ReactDOM.render(<BrowserRouter id="UA-42983348-1"><App /></BrowserRouter>, document.getElementById('root'));
LocalStorageCacheServiceWorker();
