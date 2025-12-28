const express = require('express');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const COUNT_FILE = path.join(__dirname, 'count.txt');

let count = 0;

// Load initial count from file
function loadCount() {
  try {
    if (fs.existsSync(COUNT_FILE)) {
      const data = fs.readFileSync(COUNT_FILE, 'utf8');
      count = parseInt(data, 10) || 0;
      console.log(`Loaded count: ${count}`);
    } else {
      console.log('No count.txt found, starting with 0');
    }
  } catch (err) {
    console.error('Error loading count:', err);
  }
}

// Save count to file
function saveCount() {
  try {
    fs.writeFileSync(COUNT_FILE, count.toString(), 'utf8');
    console.log(`Saved count: ${count}`);
  } catch (err) {
    console.error('Error saving count:', err);
  }
}

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// API Routes
app.get('/api/count', (req, res) => {
  res.json({ count });
});

app.post('/api/count', (req, res) => {
  count = req.body.count || 0;
  saveCount();
  res.json({ count });
});

// Initialize
loadCount();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Assumes port 300 taken - docker run -p 3001:3000 -v ~/Code/docker-examples/mount_persistant_html_expose_server/count.txt:/app/count.txt IMAGE_ID
