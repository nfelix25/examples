import express from 'express';
import ollama from 'ollama';
import cluster from 'node:cluster';
import os from 'node:os';

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  console.log(`Primary ${process.pid} is running`);
  console.log(`Forking for ${numCPUs} CPUs`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  console.log(`Worker ${process.pid} started`);

  const app = express();

  const PORT = process.env.PORT || 3000;
  const MODEL = 'llama3.2:1b';

  app.get('/', async (req, res) => {
    console.log(`Handling request on worker ${process.pid}`);
    const joke = await ollama.chat({
      model: MODEL,
      messages: [
        {
          role: 'user',
          content:
            'Tell me a funny joke about web development. Only return the joke itself, no extra text or explanation.',
        },
      ],
      options: {
        num_ctx: 2048, // Smaller context window for faster inference
        num_predict: 512, // Limit the response length
        temperature: 0.6, // Add some randomness for humor
      },
    });
    res.send(joke.message.content);
  });

  app.listen(PORT, async () => {
    console.log(`Server starting on port ${PORT}...`);

    // Preload the model into memory
    console.log('Preloading model...');
    const year3000BCHistoricalFact = await ollama.chat({
      model: MODEL,
      messages: [
        {
          role: 'user',
          content:
            'What is a historical fact about the year 3000 BC? Return only the fact itself.',
        },
      ],
      options: {
        num_ctx: 2048, // Smaller context window for faster inference
        num_predict: 256, // Limit the response length
      },
    });
    console.log(year3000BCHistoricalFact.message.content);
  });
}
