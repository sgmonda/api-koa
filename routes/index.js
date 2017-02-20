const routes = {
  hello  : require('./hello'),
  status : require('./status'),
};

module.exports = {
  '/status': {
    get: {handlers: routes.status, public: true},
  },
  '/hello/public': {
    get  : {handlers: routes.hello.public, public: true},
    post : {handlers: routes.hello.post, public: true},
  },
  '/hello/private': {
    get: {handlers: routes.hello.private},
  },
};
