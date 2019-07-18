require('jsdom-worker')
const fs = require('fs')
const path = require('path')
const code = fs.readFileSync(path.join(__dirname + '/../src/index.js'))

test('solc EventEmitter', () => {
  var link = document.createElement('link');
  link.rel = 'script';
  link.href = window.URL.createObjectURL(new Blob([code]));
  document.body.appendChild(link);
  expect(document.body.childNodes.length).toBeGreaterThan(0);
});
