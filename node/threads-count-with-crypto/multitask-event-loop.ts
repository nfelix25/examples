import https from 'node:https';
import crypto from 'node:crypto';
import fs from 'node:fs';

const __filename = fs.realpathSync(process.argv[1]);

const log = (msg: string) => console.log(`[${Date.now() - start}ms] ${msg}`);
const start = Date.now();

log('Script start');

// Callback version - runs in poll phase

const doRequestCallback = () => {
  https
    .request('https://www.google.com', (res) => {
      log('CALLBACK: Response received (poll phase)');
      res.on('data', () => {});
      res.on('end', () => log('CALLBACK: Response ended (poll phase)'));
    })
    .end();
};

function doHash() {
  crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
    log('HASH: pbkdf2 completed (libuv thread pool)');
  });
}

function doFileRead() {
  fs.readFile(__filename, 'utf8', (err, data) => {
    if (err) {
      log(`FILE READ: readFile error (${err.code})`);
      return;
    }
    log('FILE READ: fs.readFile completed (poll phase)');
  });
}

doRequestCallback();
doFileRead();
// doHash();
// doHash();
// doHash();
// doHash();

/**

doRequestCallback();
doFileRead();
doHash();
doHash();
doHash();
doHash();

[0ms] Script start
[182ms] CALLBACK: Response received (poll phase)
[215ms] CALLBACK: Response ended (poll phase)
[783ms] HASH: pbkdf2 completed (libuv thread pool)
[784ms] HASH: pbkdf2 completed (libuv thread pool)
[784ms] FILE READ: fs.readFile completed (poll phase)
[785ms] HASH: pbkdf2 completed (libuv thread pool)
[786ms] HASH: pbkdf2 completed (libuv thread pool)

OR

[0ms] Script start
[184ms] CALLBACK: Response received (poll phase)
[227ms] CALLBACK: Response ended (poll phase)
[755ms] HASH: pbkdf2 completed (libuv thread pool)
[755ms] FILE READ: fs.readFile completed (poll phase)
[756ms] HASH: pbkdf2 completed (libuv thread pool)
[757ms] HASH: pbkdf2 completed (libuv thread pool)
[758ms] HASH: pbkdf2 completed (libuv thread pool)


Yet, when hash calls are removed, file read always completes before the request and faster then if hashes are present:


doRequestCallback();
doFileRead();

[0ms] Script start
[55ms] FILE READ: fs.readFile completed (poll phase)
[209ms] CALLBACK: Response received (poll phase)
[248ms] CALLBACK: Response ended (poll phase)


This is expected behavior due to the way the Node.js event loop prioritizes I/O operations and CPU-bound tasks.
Node.js uses an event-driven, non-blocking I/O model, which allows it to handle multiple operations concurrently.

1. I/O Operations (like HTTP requests and file reads) are handled in the poll phase of the event loop.
   They are generally prioritized because they are non-blocking and can be completed quickly.

2. CPU-bound tasks (like pbkdf2 hashing) are offloaded to the libuv thread pool.
   These tasks can take longer to complete and do not block the main event loop,
   but they can delay the processing of other events if they consume significant resources.

When hash calls are present, they occupy threads in the libuv thread pool,
potentially delaying the completion of other I/O operations like file reads.
When hash calls are removed, the file read operation can complete more quickly,
as there are no competing CPU-bound tasks in the thread pool.

This demonstrates how CPU-bound tasks can impact the performance of I/O operations in a Node.js application.
 */
