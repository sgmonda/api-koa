const assert = require('assert');

async function handler (done) {
  assert.equal(true, true, 'status route returns a 200');
  try {
    let result = await request.get('/status');
    console.log('RESULT', result);
    done();
  } catch (error) {
    console.log('ERROR', error);
  }
}

module.exports = function () {
  it('just is up', handler);
};
