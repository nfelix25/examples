require('dotenv').config();

const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 4000;
const DB_PROXY_PORT = process.env.DB_PORT;

// Checks env for IS_DOCKER env var set in Dockerfile and use host.docker.internal if Docker, else localhost
const isDocker = process.env.IS_DOCKER === 'true';

// Construct the DB proxy URL based on the environment - change to !isDocker to see fail case
const DB_PROXY_URL = isDocker
  ? `http://host.docker.internal:${DB_PROXY_PORT}/data`
  : `http://localhost:${DB_PROXY_PORT}/data`;

app.use(express.json());

// Fetch data from the db proxy
app.get('/data', async (req, res) => {
  console.log('Fetching data from DB proxy at', DB_PROXY_URL);
  try {
    const response = await axios.get(DB_PROXY_URL);
    res.send(response.data);
  } catch (error) {
    res.status(500).send('Error fetching data from DB proxy');
  }
});

// Send data to the db proxy
app.post('/data', async (req, res) => {
  console.log('Sending data to DB proxy at', DB_PROXY_URL);
  try {
    const newData = req.body;
    await axios.post(DB_PROXY_URL, newData);
    res.send('Data sent to DB proxy successfully');
  } catch (error) {
    res.status(500).send('Error sending data to DB proxy');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
