const assert = require('assert');

async function handler () {
  let result = await request('get', '/status');
  assert.equal(result.statusCode, 200, 'Status code is 200');
}

module.exports = function () {
  it('just is up', handler);
};
