const Solc = require('../src/Solc.js');
const events = require('events');
// const newEvent = new events.EventEmitter();
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
    console.log(link.href);
    
    window.solc = new Solc(link.href);
    window.solc.version();
    window.solc.newEvent.on('version', data => {
      console.log(data);
    });
    window.solc.version2url('v0.4.25-stable-2018.09.13');
    window.solc.newEvent.on('version2url', data => {
      console.log(data);
    });
    window.solc.newEvent.on('loadModule', data => {
      console.log(data);
    });
  });
});
