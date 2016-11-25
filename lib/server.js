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
    if (result) {
      if (!Array.isArray(result)) throw new Error('Handler result must be an array with two items: [status, body].');
      Object.assign(context, {
        status : result[0],
        body   : result[1],
      });
    }
    let responseTime = new Date - startTime;
    context.set('X-Response-Time', `${responseTime}ms`);
    context.cookies.set('example', 'hello, world', {signed: true});

    metadata.response = {time: responseTime};
    log.debug(`#response [${context.request.method}] ${context.request.url}`, metadata);

  } catch (error) {

    if (Array.isArray(error)) {
      Object.assign(context, {
        status : error[0],
        body   : {error: error[1]},
      });
      return;
    }

    context.status = 500;
    context.body = {error: 'Internal Server Error'};
    metadata.error = error;
    log.error(`#server Request crashed [${context.request.method}] ${context.request.url} :: ${error}`, metadata);
    if (error.stack) console.warn(error.stack);
  }
});

routes(app);

app.listen(PORT, () => {
  log.info(`#server Listening on port ${PORT}`);
});
