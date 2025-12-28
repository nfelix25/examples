const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const SERVER_NAME = process.env.SERVER_NAME || 'unknown';

// Middleware to parse JSON bodies
app.use(express.json());

// Server static files from the 'public' directory
app.use(express.static('public'));

// Simple server test that returns the port
app.get('/', (_req, res) => {
  res.json({
    message: `Server ${SERVER_NAME} is running`,
    port: PORT,
    serverName: SERVER_NAME,
  });
});

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', server: SERVER_NAME });
});

// Ping another server
app.get('/ping/:targetServer', async (req, res) => {
  const { targetServer } = req.params;

  try {
    const response = await axios.get(
      `http://${targetServer}:${
        targetServer === 'server-1' ? 3000 : 3001
      }/health`
    );
    res.json({
      from: SERVER_NAME,
      to: targetServer,
      status: 'success',
      response: response.data,
    });
  } catch (error) {
    res.status(500).json({
      from: SERVER_NAME,
      to: targetServer,
      status: 'failed',
      error: error.message,
    });
  }
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server ${SERVER_NAME} is running on port ${PORT}`);
});
