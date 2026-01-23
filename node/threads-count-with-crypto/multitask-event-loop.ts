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
doHash();
doHash();
doHash();
doHash();

/**
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
 */
