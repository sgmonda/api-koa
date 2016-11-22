prueba(1, undefined, 3);

function prueba (x, y = 3, z) {
  console.log(`ARGUMENTS: x=${x}, y=${y}, z=${z}`);
}

let a = {
  pepe                   : 34,
  [`jose_${Date.now()}`] : 4,
};
console.log(a);

let b = [1, 2, 3, 4, 5];
let [x, y, , , z] = b;
console.log(`PARTS: x=${x}, y=${y}, z=${z}`);

let {uno, dos, cinco} = {uno: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5};
console.log('numbers:', uno, dos, cinco);

let {x: pepe, y: {head, body}, z: jose} = {x: 'PEPE', y: {head: 'HEAD', arm: 'ARM', body: 'BODY'}, z: 'JOSE'};
console.log(`DESTRUCT: pepe=${pepe}, head=${head}, body=${body}, jose=${jose}`);

let [aa = 'a', bb = 'b', cc = 'c', dd = 'd'] = [11, 22, undefined, 33];
console.log(`LETTERS: a=${aa}, b=${bb}, c=${cc}, d=${dd}`);

async function read () {
  console.log(await mySlowFunction(1));
  console.log(await mySlowFunction(2));
  console.log(await mySlowFunction(3));
  try {
    console.log(await mySlowFunction(4));
    console.log(await mySlowFunction(5));
    console.log(await mySlowFunction(6));
    console.log('TERMINA EL TRY');
  } catch (error) {
    console.log('CATCH', error);
  }
  return 23;
}

read().then(result => console.log('SUCCESS', result), error => console.log('ERROR', error));

function mySlowFunction (number) {
  let p = new Promise((resolve, reject) => {
    setTimeout(function () {
      if (number > 5) reject(`${number} > 5`);
      else resolve(`${number} <= 5`);
    }, 1000);
  });
  return p;
}
