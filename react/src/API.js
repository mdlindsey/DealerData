import { ajax } from 'jquery';
export default class {
  constructor(host) {
    this.host = host;
  }
  Fetch(uri, incomingData) {
    let host = this.host + (uri === undefined ? '' : uri);
    return new Promise(function(resolve, reject) {
      ajax({
        url: host,
        type: 'post',
        data: incomingData,
        xhrFields: { withCredentials: true }, // use this if using sessions/cookies (not used, just helpful)
      })
      .then((data,status) => {
        // Get the result and transform into valid JSON
        if ( typeof data === typeof 'str' ) {
          try {
            data = JSON.parse(data);
          } catch(e) {
            reject(data,status);
            console.log('Exception: ', e);
            console.log('API Returned non-JSON result: ', data);
          }
        }

        if ( data.error !== null )
          reject('API error: '+data.error);
        resolve(data.output);
      });
    });
  }
};
