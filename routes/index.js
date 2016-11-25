const KoaRouter = require('koa-router')();

const hello = require('./hello');
const status = require('./status');

const ROUTER = {
  '/status': {
    get: {handlers: status},
  },
  '/hello/public': {
    get: {handlers: hello.public, public: true},
  },
  '/hello/private': {
    get: {handlers: hello.private},
  },
};

module.exports = (app) => {
  for (let path in ROUTER) for (let method in ROUTER[path]) {
    let handlers = ROUTER[path][method].handlers;
    if (!ROUTER[path][method].public) handlers.unshift(privatize);
    handlers.unshift(authentication);
    for (let handler of handlers) {
      KoaRouter[method](path, handler);
    }
  }
  app.use(KoaRouter.routes());
  app.use(KoaRouter.allowedMethods());
};

async function authentication (context, next) {
  let token = context.request.header.authorization || context.cookies.get('authorization');
  context.state.token = token;
  return next();
}

async function privatize (context, next) {
  if (!context.state.token) {
    throw [401, 'Missing authorization header'];
  }
  return next();
}
