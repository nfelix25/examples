/**
 * Illustrates the pending callbacks phase of the Node.js event loop with comments and examples.
 *
 * Pending callbacks sit between the poll phase (where most I/O callbacks fire) and the check
 * phase (where `setImmediate` callbacks run). Node.js schedules a small set of system-level
 * callbacks inside this queue—TCP errors, `fs` extreme conditions, and other libuv plumbing.
 * We cannot directly control the pending-callbacks queue, but we can observe its placement by
 * structuring other asynchronous work around it.
 */

import { readFile } from 'node:fs';
import { connect } from 'node:net';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);

const log = (label: string) => {
  const time = new Date().toISOString();
  console.log(`[${time}] ${label}`);
};

log('script start - before entering the event loop');

process.nextTick(() =>
  log('microtask view: `process.nextTick` runs before the event loop phases'),
);

setTimeout(() => log('timers phase: `setTimeout` callback fired'), 0);

readFile(__filename, 'utf8', (err, data) => {
  if (err) {
    log(`poll phase: readFile error (${err.code})`);
    return;
  }

  log(
    'poll phase: `fs.readFile` callback finished. Pending callbacks slot runs immediately after this poll phase iteration.',
  );
});

setImmediate(() =>
  log('check phase: `setImmediate` runs after the pending callbacks phase'),
);

/**
 * Connect to a deliberately unreachable port to surface the kind of error callbacks that
 * libuv defers to the pending callbacks phase. TCP connection failures like ECONNREFUSED are
 * processed inside the pending callbacks queue before the check phase executes.
 */
const unreachable = connect({ host: '127.0.0.1', port: 9999 }, () => {
  log('reachable unexpectedly; pending callbacks demo is moot');
});

unreachable.on('error', (error) => {
  log(
    `pending callbacks phase: TCP error handler got ${(error as NodeJS.ErrnoException).code ?? error.message}`,
  );
});

unreachable.on('close', () => {
  log('pending callbacks phase: socket closed after error');
});
