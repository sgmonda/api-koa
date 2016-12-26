const crypto = require('crypto');

exports.token = () => {
  let seed = new Date().toISOString() + Math.random().toString(32).slice(2);
  return crypto.createHash('sha256').update(seed).digest('hex');
};
