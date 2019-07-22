const solc = require('../src/');
const events = require('events');
const newEvent = new events.EventEmitter();

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
    window.solc = solc;
    window.solc.version2url('v0.4.25-stable-2018.09.13');
    
    newEvent.on('version', data => {
      expect(data).toBe(true);
    });

    newEvent.on('version2url', data => {
      expect(data.url).toBe(
        'https://solc-bin.ethereum.org/bin/soljson-v0.4.25+commit.59dbf8f1.js'
      );
    });

    newEvent.on('loadModule', data => {
      expect(data.solc).toBe('string');
    });
  });
});
