const KoaRouter = require('koa-router')();

const routes = {
  hello: require('./hello'),
};

const ROUTER = {
  '/hello/public': {
    get: routes.hello.public,
  },
  '/hello/private': {
    get: routes.hello.private,
  },
};

async function authentication (context, next) {
  let token = context.request.header.authorization || context.cookies.get('authorization');
  context.state.token = token;
  return next();
}

async function privatize (context, next) {
  if (!context.state.token) {
    throw {status: 401, message: 'Missing authorization header'};
  }
  return next();
}

module.exports = (app) => {
  for (let path in ROUTER) for (let method in ROUTER[path]) {
    let handlers = ROUTER[path][method];
    if (isPrivate(method, path)) handlers.unshift(privatize);
    handlers.unshift(authentication);
    for (let handler of handlers) {
      KoaRouter[method](path, handler);
    }
  }
  app.use(KoaRouter.routes());
  app.use(KoaRouter.allowedMethods());
};

function isPrivate (method, path) {
  if (/public/.test(path)) return false;
  // @TODO Return false for public routes
  return true;
}
