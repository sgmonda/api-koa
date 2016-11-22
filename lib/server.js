const Koa = require('koa');

const app = new Koa();
const PORT = 4344;

app.use(async (context, next) => {
  let metadata = {
    request: {
      id     : Math.random().toString(32).slice(2),
      header : context.request.header,
    },
  };
  try {
    let startTime = new Date;
    log.debug(`#request [${context.request.method}] ${context.request.url}`, metadata);
    let result = await next();
    let responseTime = new Date - startTime;
    metadata.response = {time: responseTime};
    log.debug(`#response [${context.request.method}] ${context.request.url}`, metadata);
    context.set('X-Response-Time', responseTime + 'ms');
    context.cookies.set('example', 'hello, world', {signed: true});
    if (result) context.body = result;
  } catch (error) {
    if (!error.status) log.error(`Request crashed [${context.request.method}] ${context.request.url}`, metadata);
    context.body = {message: error.message};
    context.status = error.status || 500;
  }
});

app.use(async () => {
  let result = await myTask();
  log.info('result:', result, {estoesmetadata: 'hello metadata'});
  return result;
});

function myTask () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('hello');
    }, 1000);
  });
}

app.keys = SETTINGS.KEYS;
app.on('error', (err) => {
  log.error('server error', err);
});
app.listen(PORT, () => {
  log.info(`Server listening on port ${PORT}`);
});
