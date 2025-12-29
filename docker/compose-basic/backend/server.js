const express = require('express');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

const { Item } = require('../db/db');
const port = process.env.PORT;
const logDirectory = path.join(__dirname, '../logs');

const app = express();

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(
  path.join(logDirectory, 'access.log'),
  { flags: 'a' }
);

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }));

// Middleware to parse JSON
app.use(express.json());

// Endpoint to add an item
app.post('/add', async (req, res) => {
  const newItem = new Item({ name: req.body.name });
  await newItem.save();
  res.send('Item added');
});

// Endpoint to get all items
app.get('/items', async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
