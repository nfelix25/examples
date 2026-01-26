// Use Node to run server js then use apache benchmark to test

import { exec } from 'node:child_process';
import os from 'node:os';

const command = 'node cluster-example-crypto.ts'; // Command to run

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

const [c, n] = [os.cpus().length, os.cpus().length]; // concurrency and number of requests

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
