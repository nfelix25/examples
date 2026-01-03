const crypto = require('crypto');

const start = Date.now();

const getCryptoArgs = (i) => [
  'a',
  'b',
  100000,
  512,
  'sha512',
  () => console.log(i, Date.now() - start),
];

crypto.pbkdf2(...getCryptoArgs(1));
crypto.pbkdf2(...getCryptoArgs(2));
crypto.pbkdf2(...getCryptoArgs(3));
crypto.pbkdf2(...getCryptoArgs(4));
crypto.pbkdf2(...getCryptoArgs(5));
