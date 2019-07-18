// const solc = require('../src/');

require('jsdom-worker');
const path = require('path');
// const { URL } = require('url');

describe('solc EventEmitter', () => {
  it('returns compile result', () => {
    const solcWorker = new Worker(
      URL.(path.join(__dirname + '/../src/solcWorker.js'))
    );

    solcWorker.onmessage = data => {
      console.log('Test working', data);
    };

    // expect(solc()).toBe(true);
  });
});
