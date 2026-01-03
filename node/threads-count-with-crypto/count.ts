import { pbkdf2 } from 'node:crypto';
import { argv } from 'node:process';

const start = Date.now();

// Get the count arg

const _count = parseInt(argv[2]);
const count = isNaN(_count) ? 5 : _count;
let i = 0;

while (i < count) {
  i++;
  pbkdf2(
    'a',
    'b',
    100000,
    512,
    'sha512',
    function (i: number) {
      console.log(i, Date.now() - start);
    }.bind(this, i)
  );
}

// To run this example, use the following command:
// node --threads-count=4 count.ts 10
// The number at the end (10) is optional and indicates how many pbkdf2 operations to run.
// If not provided, it defaults to 5.
// You can adjust the --threads-count flag to see how it affects performance.
