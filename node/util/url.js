'use strict';
const https = require('https');
module.exports = {
  get: (url) => new Promise((resolve, reject) => {
    https.request(url, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve(data);
        });
    }).on('error', (e) => {
      reject('https.request error');
    }).end();
  })
}
