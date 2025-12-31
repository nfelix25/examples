import mongoose from 'mongoose';

// Define a simple schema and model
const itemSchema = new mongoose.Schema({
  name: String,
});

export const Item = mongoose.model('Item', itemSchema);
