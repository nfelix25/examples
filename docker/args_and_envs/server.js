// Simple express server that expects EXTERNAL_PORT to come in from docker ENV

const express = require('express');
const app = express();

const PORT = process.env.PORT;

app.get('/', (req, res) => {
  res.send(`Server is running on port ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
