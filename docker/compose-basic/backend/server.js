const express = require('express');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

const { Item } = require('./ItemSchema.js');
const { default: mongoose } = require('mongoose');
const cors = require('cors');

// Normally may have db logic in backend service, this is overkill for learning

const MONGO_CONTAINER_NAME = process.env.MONGO_CONTAINER_NAME;
const MONGO_USERNAME = process.env.MONGO_INITDB_ROOT_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_INITDB_ROOT_PASSWORD;

const mongoURL = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_CONTAINER_NAME}:27017/test?authSource=admin`;

// Connect to MongoDB
mongoose.connect(mongoURL);

const port = process.env.PORT;
const logDirectory = path.join(__dirname, '../logs');

const app = express();

// Allows CORS from frontend container
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:4173',
  })
);

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
