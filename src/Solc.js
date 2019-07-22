const solcjsCore = require('solcjs-core');
const EventEmitter = require('events');
require('jsdom-worker');
function Solcjs(_version) {
  this.newCompile;
  this.version;
  this.compilersource;
  this.solc;
  this.url;
  this.newEvent = new EventEmitter();
  this.solcWorker = new Worker('solcWorker.js');
}

Solcjs.prototype.version = () => {
  this.solcWorker.postMessage({ type: 'getVersions' });
};

Solcjs.prototype.version2url = () => {
  this.solcWorker.postMessage({ type: 'version2url', version: this.version });
};

Solcjs.prototype.onmessage = data => {
  if (data.type == 'versions') {
    this.version = data.version;
    this.newEvent.emit('version', this.version);
  }
  if (data.type == 'version2url') {
    this.compilersource = data.compilersource;
    this.url = data.url;
    this.newEvent.emit('version2url', {
      url: this.url,
      compilersource: this.compilersource
    });
  }

  if (data.type == 'loadModule') {
    this.solc = data.solc;
    this.newEvent.emit('loadModule', this.solc);
  }
  if (data.type == 'wrapCompiler') {
    this.newCompile = data.newCompile;
  }
};

module.exports = Solcjs;
