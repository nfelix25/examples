const mode = process.env.MODE || 'promise';
const yieldEvery = Number(process.env.YIELD_EVERY || 0);

let iterations = 0;
const started = Date.now();
let timerFires = 0;
let lastTimer = Date.now();

setInterval(() => {
  const now = Date.now();
  const drift = now - lastTimer - 1000;
  lastTimer = now;
  timerFires++;
  console.log('timer fired', timerFires, 'drift(ms)=', drift);
}, 1000);

function schedule() {
  iterations++;
  if (iterations % 5_000_000 === 0) {
    const elapsed = ((Date.now() - started) / 1000).toFixed(1);
    console.log('microtasks:', iterations, 'elapsed(s)=', elapsed);
  }
  if (yieldEvery > 0 && iterations % yieldEvery === 0) {
    setImmediate(schedule);
    return;
  }
  if (mode === 'nextTick') {
    process.nextTick(schedule);
  } else {
    Promise.resolve().then(schedule);
  }
}

console.log('mode:', mode, 'yieldEvery:', yieldEvery || 'none');
console.log('pid:', process.pid);
console.log('Try: YIELD_EVERY=100000 MODE=promise node demos/microtask-starvation.js');

schedule();
