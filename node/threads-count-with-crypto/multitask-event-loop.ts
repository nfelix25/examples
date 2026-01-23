import https from 'node:https';
import crypto from 'node:crypto';
import fs from 'node:fs';

// process.env.UV_THREADPOOL_SIZE = '5';

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
 * LIBUV THREAD POOL AND EVENT LOOP INTERACTION DEMONSTRATION
 *
 * This example demonstrates the relationship between the libuv thread pool,
 * different types of I/O operations, and the Node.js event loop phases.
 *
 * EXPECTED OUTPUT WITH HASHES:
 *
 * doRequestCallback();
 * doFileRead();
 * doHash();
 * doHash();
 * doHash();
 * doHash();
 *
 * [0ms] Script start
 * [182ms] CALLBACK: Response received (poll phase)
 * [215ms] CALLBACK: Response ended (poll phase)
 * [783ms] HASH: pbkdf2 completed (libuv thread pool)
 * [784ms] HASH: pbkdf2 completed (libuv thread pool)
 * [784ms] FILE READ: fs.readFile completed (poll phase)
 * [785ms] HASH: pbkdf2 completed (libuv thread pool)
 * [786ms] HASH: pbkdf2 completed (libuv thread pool)
 *
 * EXPECTED OUTPUT WITHOUT HASHES:
 *
 * doRequestCallback();
 * doFileRead();
 *
 * [0ms] Script start
 * [55ms] FILE READ: fs.readFile completed (poll phase)
 * [209ms] CALLBACK: Response received (poll phase)
 * [248ms] CALLBACK: Response ended (poll phase)
 *
 *
 * KEY INSIGHTS - WHY THE TIMING AND ORDER DIFFER:
 *
 * 1. HTTPS REQUESTS (Network I/O):
 *    - Handled by the OS kernel using native async I/O (epoll/kqueue)
 *    - Does NOT use the libuv thread pool
 *    - Completes when the network response arrives (~180-200ms network latency)
 *    - Callback fires in the poll phase when the socket becomes readable
 *
 * 2. FILE READS (fs.readFile):
 *    - Uses the libuv thread pool (default 4 threads via UV_THREADPOOL_SIZE)
 *    - Why? Most filesystems lack true async I/O APIs, so libuv simulates it
 *    - fs.readFile() is actually a SEQUENCE of threadpool operations:
 *      1. open() - open the file descriptor (threadpool)
 *      2. fstat() - get file size to allocate buffer (threadpool)
 *      3. read() - read file contents (threadpool)
 *      4. close() - close file descriptor (threadpool)
 *    - Each step must complete before the next can start
 *    - Without contention: all steps complete quickly (~55ms total)
 *    - With contention: each step may queue, compounding the delay
 *
 * 3. CRYPTO OPERATIONS (pbkdf2):
 *    - Uses the libuv thread pool (CPU-intensive work)
 *    - Each hash takes ~750-800ms to complete
 *    - With default 4 threads: first 4 hashes run in parallel
 *
 * 4. THREAD POOL CONTENTION - WHY FILE READ QUEUES DESPITE BEING CALLED FIRST:
 *    - With 4 hashes + 1 file read = 5+ operations competing for 4 threads
 *      (Actually more like 9 operations: 4 hashes + 4 file operations from fs.readFile)
 *    - Even though doFileRead() is called before doHash(), all operations are
 *      submitted to the thread pool synchronously in the same tick
 *    - The thread pool doesn't guarantee FIFO (first-in-first-out) ordering
 *    - When many operations arrive "simultaneously", the pool picks 4 to run immediately
 *    - fs.readFile()'s first operation (open) may get queued behind the hashes
 *    - Even if open() completes, fstat() and read() may also queue behind remaining hashes
 *    - This sequential dependency amplifies the delay - each step waits for thread availability
 *    - Result: file read is delayed from ~55ms to ~780ms (waiting for thread availability)
 *    - Call order doesn't determine execution order when thread pool is saturated
 *
 * 5. HTTPS COMPLETES FIRST WHEN THREAD POOL IS SATURATED:
 *    - Network I/O is completely independent of the thread pool
 *    - The HTTPS request uses kernel-level async I/O (no threads needed)
 *    - It completes based on network latency, unaffected by CPU workload
 *    - This is why it finishes at ~180ms whether or not hashes are running
 *
 * 6. EVENT LOOP POLL PHASE:
 *    - All I/O completion callbacks (network, file) fire in the poll phase
 *    - The event loop checks for completed operations each iteration
 *    - As operations complete (in libuv or kernel), their callbacks are queued
 *    - Callbacks execute in the order their operations complete
 *
 * ARCHITECTURAL TAKEAWAYS:
 *
 * - Not all I/O uses the thread pool - network I/O uses kernel async mechanisms
 * - File I/O uses the thread pool because most filesystems lack true async APIs
 * - Thread pool size (UV_THREADPOOL_SIZE) directly affects throughput for
 *   file operations and crypto work
 * - CPU-bound threadpool operations can starve file I/O by monopolizing threads
 * - Network I/O performance is isolated from thread pool congestion
 * - Understanding which operations use which mechanism is critical for
 *   performance tuning and avoiding bottlenecks
 *
 * BONUS - Output with process.env.UV_THREADPOOL_SIZE = '5':
 *
 * [0ms] Script start
 * [77ms] FILE READ: fs.readFile completed (poll phase)
 * [192ms] CALLBACK: Response received (poll phase)
 * [227ms] CALLBACK: Response ended (poll phase)
 * [747ms] HASH: pbkdf2 completed (libuv thread pool)
 * [748ms] HASH: pbkdf2 completed (libuv thread pool)
 * [750ms] HASH: pbkdf2 completed (libuv thread pool)
 * [756ms] HASH: pbkdf2 completed (libuv thread pool)
 *
 * Increased thread pool size to 5 allows all operations to run concurrently,
 * eliminating file read delay. File read completes at ~50-75ms as expected.
 */
