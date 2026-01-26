import express from 'express';
import cluster from 'node:cluster';
import os from 'node:os';
import { pbkdf2 } from 'node:crypto';

process.env.UV_THREADPOOL_SIZE = '1';

if (cluster.isPrimary) {
  const numForks = os.cpus().length;
  console.log(`Primary ${process.pid} is running`);
  console.log(`Forking for ${numForks} CPUs`);

  for (let i = 0; i < numForks; i++) {
    cluster.fork();
  }
} else {
  console.log(`Worker ${process.pid} started`);

  const app = express();

  const PORT = process.env.PORT || 3000;

  app.get('/work', (req, res) => {
    console.log(`Handling request on worker ${process.pid}`);
    pbkdf2('a', 'b', 100000, 512, 'sha512', function () {
      console.log(`Work done by ${process.pid}`);
      res.send('Work done');
    });
  });

  app.get('/', async (req, res) => {
    console.log(`Handling request on worker ${process.pid}`);
    res.send(
      'Hello from the cluster server! Visit /work to perform CPU-intensive work.',
    );
  });

  app.listen(PORT, async () => {
    console.log(`Server starting on port ${PORT}...`);
  });
}
