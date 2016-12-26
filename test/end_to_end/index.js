const request = require('superagent');
request.then = request.end;
global.request = request;

module.exports = function () {
  describe('status', require('./status'));
};
