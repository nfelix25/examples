// Use the MONGO_IP environment variable to connect to MongoDB with mongoose using simple read/write endpoints write just adds to db and read gets all entries from db
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Using Dockerfile for ENV instead of dotenv here
const port = process.env.PORT;
const MONGO_CONTAINER_NAME = process.env.MONGO_CONTAINER_NAME;
const mongoURL = `mongodb://${MONGO_CONTAINER_NAME}:27017/test`;

console.log('Connecting to MongoDB at:', mongoURL);

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(mongoURL)
  .then(() => console.log('Connected to MongoDB at', mongoURL))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define a simple schema and model
const itemSchema = new mongoose.Schema({
  name: String,
});

const Item = mongoose.model('Item', itemSchema);

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
