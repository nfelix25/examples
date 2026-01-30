let iterations = 0;
const started = Date.now();

function spin() {
  iterations++;
  setImmediate(spin);
}

spin();

setInterval(() => {
  const elapsed = (Date.now() - started) / 1000;
  const perSec = Math.round(iterations / elapsed);
  console.log('setImmediate spin:', perSec, 'iterations/sec');
}, 1000);
