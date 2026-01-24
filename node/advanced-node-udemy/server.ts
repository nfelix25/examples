import express from 'express';
import ollama from 'ollama';

const app = express();

const PORT = process.env.PORT || 3000;
const MODEL = 'llama3.2:1b';

app.get('/', async (req, res) => {
  const joke = await ollama.chat({
    model: MODEL,
    messages: [
      {
        role: 'user',
        content:
          'Tell me a short, funny joke about JavaScript. Only return the joke itself, no extra text or explanation.',
      },
    ],
    options: {
      num_ctx: 2048, // Smaller context window for faster inference
      num_predict: 256, // Limit the response length
    },
  });
  res.send(joke.message.content);
});

app.listen(PORT, async () => {
  console.log(`Server starting on port ${PORT}...`);

  // Preload the model into memory
  console.log('Preloading model...');
  await ollama.chat({
    model: MODEL,
    messages: [{ role: 'user', content: 'Hi' }],
    options: { num_predict: 1 },
  });
  console.log('Model loaded and ready!');
});
