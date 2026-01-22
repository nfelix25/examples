import { pbkdf2 } from 'node:crypto';
import { argv } from 'node:process';
import { cpus } from 'node:os';

// Get CPU information
const cpuCores = cpus();
const coreCount = cpuCores.length; // Number of logical cores (threads)
console.log(`CPU cores/threads: ${coreCount}`);
console.log(`CPU model: ${cpuCores[0].model}`);

// Env variable must be set before loading any module that uses libuv thread pool
process.env.UV_THREADPOOL_SIZE =
  process.env.UV_THREADPOOL_SIZE || `${coreCount}`;

const start = Date.now();

const _poolSize = parseInt(process.env.UV_THREADPOOL_SIZE);
const poolSize = isNaN(_poolSize) ? 4 : _poolSize;

const _count = parseInt(argv[2]);
const count = isNaN(_count) ? 5 : _count;

let i = 0,
  pool = 0;

while (i < count) {
  if (i % poolSize === 0) {
    pool++;
  }

  pbkdf2(
    'a',
    'b',
    100000,
    512,
    'sha512',
    function (args: [number, number]) {
      const [i, pool] = args;
      console.log(i + 1, pool, Date.now() - start);
    }.bind(this, [i, pool]),
  );

  i++;
}

// To run this example, use the following command:
//  UV_THREADPOOL_SIZE=N node count.ts 10
// The number at the end (10) is optional and indicates how many pbkdf2 operations to run.
// If not provided, it defaults to 5.
// You can adjust the UV_THREADPOOL_SIZE value to see how it affects performance (libuv thread pool size).
