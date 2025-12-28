// Simple express server that expects PORT to come in from docker ENV via EXTERNAL_PORT build-arg

const express = require('express');
const app = express();

const PORT = process.env.PORT;
const MESSAGE = process.env.MESSAGE;

console.log(`Server starting with PORT: ${PORT} and MESSAGE: ${MESSAGE}`);

app.get('/', (req, res) => {
  res.send(
    `<div id="port-info">Server is running on port: ${PORT}.<p>${MESSAGE}</p></div>`
  );
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
