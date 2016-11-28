module.exports = async function (context, next) {
  let token = context.request.header.authorization || context.cookies.get('authorization');
  context.state.token = token;
  context.cookies.set('authorization', token, {signed: true});
  return next();
};
