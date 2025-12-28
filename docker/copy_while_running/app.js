// Simple Node.js app that processes an input file and creates an output file
// This demonstrates docker cp by copying files TO and FROM the container

const fs = require('fs');

console.log('App started - waiting for input.txt...');

// Check for input.txt every 2 seconds
setInterval(() => {
  if (fs.existsSync('/app/input.txt')) {
    console.log('Found input.txt! Processing...');

    const input = fs.readFileSync('/app/input.txt', 'utf8');
    const output = input.toUpperCase() + '\n\nProcessed by Docker container!';

    fs.writeFileSync('/app/output.txt', output);
    console.log('Created output.txt - you can copy it out now!');

    // Remove input.txt so we can process again if needed
    fs.unlinkSync('/app/input.txt');
  }
}, 2000);

console.log('Ready! Copy a file in with: docker cp input.txt <container>:/app/');
