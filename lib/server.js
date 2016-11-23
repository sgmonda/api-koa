const Koa = require('koa');

const random = require('./random');
const routes = require('../routes');

const app = new Koa();
const PORT = 4344;

app.keys = SETTINGS.KEYS;
app.on('error', (error) => log.error(`#server Unhandled error: ${error}`, error));

app.use(async (context, next) => {

  let metadata = {
    request: {id: random.token(), header: context.request.header},
  };

  try {

    let startTime = new Date;
    log.debug(`#request [${context.request.method}] ${context.request.url}`, metadata);
    let result = await next(context);
    let responseTime = new Date - startTime;
    metadata.response = {time: responseTime};
    log.debug(`#response [${context.request.method}] ${context.request.url}`, metadata);

    context.set('X-Response-Time', `${responseTime}ms`);
    context.cookies.set('example', 'hello, world', {signed: true});
    if (result) context.body = result;

  } catch (error) {

    if (error.status) {
      context.status = error.status;
      if (error.message) context.body = {message: error.message};
      return;
    }

    context.status = 500;
    context.body = undefined;
    metadata.error = error;
    log.error(`#server Request crashed [${context.request.method}] ${context.request.url} :: ${error}`, metadata);
    if (error.stack) console.warn(error.stack);
  }
});

routes(app);

app.listen(PORT, () => {
  log.info(`#server Listening on port ${PORT}`);
});
