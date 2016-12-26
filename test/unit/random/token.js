const assert = require('assert');
const random = require('../../../lib/random');

module.exports = function () {
  it('length', function() {
    let token = random.token();
    assert.equal(token.length, 64, 'token length should be exactly 64');
  });
};
