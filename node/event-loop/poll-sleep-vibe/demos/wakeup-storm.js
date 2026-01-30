const net = require('net');

const forever = process.argv.includes('--forever');
const fix = process.env.FIX === '1';
const durationMs = 10_000;

let bytes = 0;
let events = 0;
let start = Date.now();

const server = net.createServer((socket) => {
  socket.on('data', (chunk) => {
    bytes += chunk.length;
    events++;
    if (fix) {
      socket.pause();
      setTimeout(() => socket.resume(), 10);
    }
  });
});

server.listen(0, '127.0.0.1', () => {
  const port = server.address().port;
  console.log('wakeup-storm server on port', port, 'fix:', fix);
  console.log('pid:', process.pid);
  startClient(port);
});

function startClient(port) {
  const client = net.connect(port, '127.0.0.1');
  client.setNoDelay(true);
  const payload = Buffer.alloc(512, 0x61);

  function writeLoop() {
    let ok = true;
    while (ok) {
      ok = client.write(payload);
    }
    if (!ok) {
      client.once('drain', writeLoop);
    }
  }

  client.on('connect', () => {
    writeLoop();
  });
}

setInterval(() => {
  const now = Date.now();
  const sec = (now - start) / 1000;
  const eps = Math.round(events / sec);
  const bps = Math.round(bytes / sec);
  console.log('events/sec', eps, 'bytes/sec', bps);
  if (!forever && now - start > durationMs) {
    console.log('stopping after', durationMs / 1000, 'seconds');
    process.exit(0);
  }
}, 1000);
