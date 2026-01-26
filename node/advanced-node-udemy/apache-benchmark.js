// Use Node to run server js then use apache benchmark to test

import { exec } from 'node:child_process';
import os from 'node:os';

const NUM_CORES = os.cpus().length / 2; // Adjust number of cores to use physical cores

const command = `NUM_CORES=${NUM_CORES} node cluster-example-crypto.ts`; // Command to run

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
  }
  console.log(`stdout: ${stdout}`);
});

// Then in another terminal, run the following command to benchmark:
// ab -n 100 -c 10 http://localhost:3000/work
// This will send 100 requests with a concurrency level of 10 to the /work endpoint.

// Adjust the -n and -c parameters as needed for your testing.

const [c, n] = [NUM_CORES, NUM_CORES]; // concurrency and number of requests

// This is with os.cpus().length instances of cluster.fork();

/*

Concurrency Level:      16
Time taken for tests:   3.783 seconds
Complete requests:      32
Failed requests:        0
Total transferred:      6624 bytes
HTML transferred:       288 bytes
Requests per second:    8.46 [#/sec] (mean)
Time per request:       1891.548 [ms] (mean)
Time per request:       118.222 [ms] (mean, across all concurrent requests)
Transfer rate:          1.71 [Kbytes/sec] received

              min  mean[+/-sd] median   max
Connect:        0    0   0.3      0       1
Processing:   644 1538 170.5   1595    1655
Waiting:      642 1537 170.5   1594    1655
Total:        644 1538 170.6   1596    1656

Percentage of the requests served within a certain time (ms)
  50%   1596
  66%   1609
  75%   1615
  80%   1616
  90%   1619
  95%   1625
  98%   1656
  99%   1656
 100%   1656 (longest request)
*/

// const [c, n] = [NUM_CORES * 2, NUM_CORES * 2];

/*

Concurrency Level:      32
Time taken for tests:   3.741 seconds
Complete requests:      32
Failed requests:        0
Total transferred:      6624 bytes
HTML transferred:       288 bytes
Requests per second:    8.55 [#/sec] (mean)
Time per request:       3741.498 [ms] (mean)
Time per request:       116.922 [ms] (mean, across all concurrent requests)
Transfer rate:          1.73 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    1   0.3      1       1
Processing:   624 2271 809.7   1622    3117
Waiting:      622 2270 810.3   1620    3117
Total:        624 2272 809.5   1623    3118

Percentage of the requests served within a certain time (ms)
  50%   1623
  66%   3099
  75%   3104
  80%   3105
  90%   3107
  95%   3113
  98%   3118
  99%   3118
 100%   3118 (longest request)

 */

// Running more requests concurrently than the number of CPU cores is slower than running equal or less requests than cores with the same number of requests.

const benchmarkCommand = `ab -n ${n} -c ${c} http://localhost:3000/work`;

setTimeout(() => {
  exec(benchmarkCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Benchmark exec error: ${error}`);
      return;
    }
    if (stderr) {
      console.error(`Benchmark stderr: ${stderr}`);
    }
    console.log(`Benchmark stdout:\n${stdout}`);
  });
}, 1000); // Delay to allow server to start
