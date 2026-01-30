const net = require('net');

const server = net.createServer((socket) => {
  socket.end('hello\n');
});

server.listen(3333, '127.0.0.1', () => {
  console.log('idle-sleep: listening on 127.0.0.1:3333');
  console.log('pid:', process.pid);
  console.log('Try: nc 127.0.0.1 3333');
});
