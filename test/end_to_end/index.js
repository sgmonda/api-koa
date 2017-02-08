const superagent = require('superagent');
superagent.then = superagent.end;

global.SETTINGS = require('../../settings');
global.request = (method, url) => {
  url = `localhost:${SETTINGS.PORT}${url}`;
  let req = superagent[method](url);
  return new Promise((resolve, reject) => {
    req.end((error, response) => {
      if (error) return reject(error);
      return resolve(response);
    });
  });
};

module.exports = function () {
  describe('status', require('./status'));
};
