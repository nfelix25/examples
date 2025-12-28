require('dotenv').config();
const express = require('express');
const fs = require('node:fs');

const app = express();

const PORT = process.env.DB_PORT;
const DB_FILE = 'db.json';

app.use(express.json());

// Read from the JSON file
app.get('/data', (req, res) => {
  console.log('Received request to fetch data');
  fs.readFile(DB_FILE, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading database');
    }
    res.send(JSON.parse(data));
  });
});

// Write to the JSON file
app.post('/data', (req, res) => {
  const newData = req.body;
  console.log('Received data to save:', newData);
  fs.writeFile(DB_FILE, JSON.stringify(newData, null, 2), (err) => {
    if (err) {
      return res.status(500).send('Error writing to database');
    }
    res.send('Data saved successfully');
  });
});

const server = app.listen(PORT, () => {
  console.log(`Dummy DB proxy server running on http://localhost:${PORT}`);
  console.log('Server listening:', server.listening);
});

// Fun note: On Mac, port 5000 is often used by AirPlay Receiver, which can cause EADDRINUSE errors.
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `Port ${PORT} is already in use. Please use a different port or stop the service using it.`
    );
    console.error(
      'On macOS, AirPlay Receiver often uses port 5000. You can disable it in System Settings > General > AirDrop & Handoff'
    );
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});

console.log('Script continues after listen...');

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
});

process.on('exit', (code) => {
  console.log('Process exiting with code:', code);
});
