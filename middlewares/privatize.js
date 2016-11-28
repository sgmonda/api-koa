module.exports = async function (context, next) {
  if (!context.state.token) {
    throw [401, 'Missing authorization header'];
  }
  return next();
};
