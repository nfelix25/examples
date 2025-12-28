const fs = require('node:fs');

const data = fs.readFileSync('./log.txt', 'utf8');

const num = parseInt(data[data.indexOf('loaded') + 7]) + 1;

// docker run -v ~/Code/docker-examples/mount_persistant_log/log.txt:/log.txt IMAGE_NAME

fs.writeFile('./log.txt', `This has been loaded ${num} times.`, err => err ?? console.error(err));
