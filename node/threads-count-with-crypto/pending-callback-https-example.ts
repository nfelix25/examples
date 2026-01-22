import https from 'node:https';

const start = Date.now();

https.request('https://www.google.com');
