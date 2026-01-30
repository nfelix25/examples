# Poll Sleep Demos

These demos accompany the blog post in ../index.html.

## Run

From this folder:

- Idle sleep: `npm run idle`
- setImmediate spin: `npm run spin`
- Microtask starvation: `npm run micro`
  - Promise chain: `MODE=promise node microtask-starvation.js`
  - nextTick chain: `MODE=nextTick node microtask-starvation.js`
  - Optional yield: `YIELD_EVERY=100000 MODE=promise node microtask-starvation.js`
- Wakeup storm: `npm run storm`
  - Fixed variant: `FIX=1 node wakeup-storm.js`
  - Run longer: `node wakeup-storm.js --forever`

## Safety

Do not run strace or perf in production without permission.
