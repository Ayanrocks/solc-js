// const solc = require('../src/');

require('jsdom-worker');
describe('solc EventEmitter', () => {
  it('returns compile result', () => {
    // const browser = puppeteer.launch({ headless: false });
    const solcWorker = new Worker();

    solcWorker.onmessage = data => {
      console.log('Test working', data);
    };

    // expect(solc()).toBe(true);
  });
});
