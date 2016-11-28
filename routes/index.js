const routes = {
  hello  : require('./hello'),
  status : require('./status'),
};

module.exports = {
  '/status': {
    get: {handlers: routes.status},
  },
  '/hello/public': {
    get: {handlers: routes.hello.public, public: true},
  },
  '/hello/private': {
    get: {handlers: routes.hello.private},
  },
};
