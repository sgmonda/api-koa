async function realHandler (context) {
  context.status = 200;
  await mySlowTask();
  await mySlowTask();
  await mySlowTask();
  return [200, context.request.body];
}

function mySlowTask () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('hello');
    }, 500);
  });
}

module.exports = [realHandler];
