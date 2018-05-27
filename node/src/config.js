// run dotenv.config() to put .env vars into process.env global
require('dotenv').config();
const dev = {
  url: {
    client: 'http://localhost:3000',
    server: 'http://localhost:3639',
  },
  port: {
    http: 3639
  },
  domain: {
    client: 'localhost',
    server: 'localhost',
    cookie: '.localhost',
  }
};
const pro = {
  ...dev,
  url: {
    client: 'https://carmax.io',
    server: 'https://api.carmax.io',
    socket: 'https://io.carmax.io',
  },
  domain: {
    client: 'carmax.io',
    server: 'api.carmax.io',
    cookie: '.carmax.io',
  },
};

module.exports = (!Number(process.env.DEV)) ? pro : dev;
