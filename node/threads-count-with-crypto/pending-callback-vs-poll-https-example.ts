import https from 'node:https';

const log = (msg: string) => console.log(`[${Date.now() - start}ms] ${msg}`);
const start = Date.now();

log('Script start');

// Callback version - runs in poll phase
https
  .request('https://www.google.com', (res) => {
    log('CALLBACK: Response received (poll phase)');
    res.on('data', () => {});
    res.on('end', () => log('CALLBACK: Response ended (poll phase)'));
  })
  .end();

// Promise version using fetch - I/O completes in poll, then() is microtask
fetch('https://www.google.com').then(() =>
  log('PROMISE: .then() handler (microtask after poll)'),
);

setImmediate(() => log('setImmediate (check phase - after poll)'));

setTimeout(() => log('setTimeout (timers phase)'), 0);
