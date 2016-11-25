const VALID_TOKENS = ['1234', '4321'];

function authorization (context, next) {
  if (!VALID_TOKENS.includes(context.state.token)) {
    throw [403, `Non authorized token ${context.state.token}`];
  }
  if (Math.random() < 0.5) {
    throw [403, 'Randomly killed'];
  }
  return next();
}

async function realHandler () {
  await mySlowTask();
  await mySlowTask();
  await mySlowTask();
  return [200, {a: 1, b: 2, c: 3}];
}

function mySlowTask () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('hello');
    }, 500);
  });
}

module.exports = [authorization, realHandler];
