async function realHandler (context) {
  context.status = 200;
  await mySlowTask();
  await mySlowTask();
  await mySlowTask();
  return [200, {a: 1, b: 2, c: 3}];
}

function mySlowTask () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('hello');
    }, 500);
  });
}

module.exports = [realHandler];
