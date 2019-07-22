const Solc = require('../src/Solc.js');
const events = require('events');
// const newEvent = new events.EventEmitter();

require('jsdom-worker');
const fs = require('fs');
const path = require('path');
const code = fs.readFileSync(path.join(__dirname + '/../src/index.js'));

describe('solc EventEmitter', () => {
  it('returns result from worker', () => {
    var link = document.createElement('link');
    link.rel = 'script';
    link.href = window.URL.createObjectURL(new Blob([code]));
    document.body.appendChild(link);
    expect(document.body.childNodes.length).toBeGreaterThan(0);
    window.solc = new Solc();
    window.solc.version();
    window.solc.newEvent.on('version', data => {
      console.log(data);
    });
  });
});
