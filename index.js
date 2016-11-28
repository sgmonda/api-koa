global.SETTINGS = require('./settings');
global.log = require('./lib/log');

let app = require('./lib/server');
app.listen(SETTINGS.PORT, () => {
  log.info(`#server Listening on port ${SETTINGS.PORT}`);
});
