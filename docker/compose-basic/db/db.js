const mongoose = require('mongoose');

const MONGO_CONTAINER_NAME = process.env.MONGO_CONTAINER_NAME;
const MONGO_USERNAME = process.env.MONGO_INITDB_ROOT_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_INITDB_ROOT_PASSWORD;

const mongoURL = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_CONTAINER_NAME}:27017/test?authSource=admin`;

console.log('Connecting to MongoDB at:', mongoURL);

// Connect to MongoDB
mongoose
  .connect(mongoURL)
  .then(() => console.log('Connected to MongoDB at', mongoURL))
  .catch((err) => console.error('MongoDB connection error:', err));
