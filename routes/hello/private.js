const VALID_TOKENS = ['1234', '4321'];

function authorization (context, next) {
  if (!VALID_TOKENS.includes(context.state.token)) {
    throw {status: 401, message: `Unknown token ${context.state.token}`};
  }
  if (Math.random() < 0.5) {
    throw {status: 403, message: 'Randomly killed'};
  }
  return next();
}

async function realHandler (context) {
  await mySlowTask();
  await mySlowTask();
  await mySlowTask();
  context.status = 200;
  return {a: 1, b: 2, c: 3};
}

function mySlowTask () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('hello');
    }, 500);
  });
}

module.exports = [authorization, realHandler];
