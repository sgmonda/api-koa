const Koa = require('koa');
const KoaRouter = require('koa-router')();

const random = require('./random');
const routes = require('../routes');
const middlewares = require('../middlewares/');

const app = new Koa();

app.keys = SETTINGS.KEYS;
app.on('error', (error) => {
  log.error(`#server Unhandled error: ${error}`, error);
});

app.use(async (context, next) => {

  let metadata = {
    request: {
      header    : context.request.header,
      id        : random.token(),
      timestamp : Date.now(),
    },
  };

  try {
    log.debug(`#request [${context.request.method}] ${context.request.url}`, metadata);
    let result = await next(context);
    if (result) {
      if (!Array.isArray(result)) {
        throw new Error('Handler result must be an array with two items: [status, body].');
      }
      Object.assign(context, {
        status : result[0],
        body   : result[1],
      });
    }
  } catch (error) {
    handleError(context, error, metadata);
  } finally {
    finalize(context, metadata);
  }
});

function handleError (context, error, metadata) {
  if (error.stack) log.error(error.stack);
  if (Array.isArray(error)) {
    Object.assign(context, {
      status : error[0],
      body   : {error: error[1]},
    });
  } else {
    context.status = 500;
    context.body = {error: 'Internal Server Error'};
    metadata.error = error;
  }
}

function finalize (context, metadata) {
  let now = Date.now();
  let responseTime = now - metadata.request.timestamp;
  context.set('X-Response-Time', `${responseTime}ms`);
  metadata.response = {
    body      : context.body,
    status    : context.status,
    time      : responseTime,
    timestamp : now,
  };
  log.debug(`#response [${context.request.method}] ${context.request.url}`, metadata);
}

for (let path in routes) for (let method in routes[path]) {
  let handlers = routes[path][method].handlers;
  if (!routes[path][method].public) {
    handlers.unshift(middlewares.privatize);
  }
  handlers.unshift(middlewares.authentication);
  for (let handler of handlers) {
    KoaRouter[method](path, handler);
  }
}
app.use(KoaRouter.routes());
app.use(KoaRouter.allowedMethods());

module.exports = app;
