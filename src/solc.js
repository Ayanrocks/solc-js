const solcjsCore = require('solcjs-core');
const EventEmitter = require('events');

async function solcjs(_version) {
  let newCompile;
  let version;
  let compilersource;
  let solc;
  let url;
  const newEvent = new EventEmitter();

  try {
    if (window.Worker) {
      const solcWorker = new window.Worker('solcWorker.js');
      solcWorker.onmessage = data => {
        if (data.type == 'versions') {
          version = data.version;
          newEvent.emit('version', version);
        }
        if (data.type == 'version2url') {
          compilersource = data.compilersource;
          url = data.url;
        }

        if (data.type == 'loadModule') {
          solc = data.solc;
        }
        if (data.type == 'wrapCompiler') {
          newCompile = data.newCompile;
        }
      };

      solcWorker.postMessage({ type: 'getVersions', _version });
      console.time('[fetch compiler]');
      solcWorker.postMessage({ type: 'version2url', version });
      console.timeEnd('[fetch compiler]');

      console.time('[load compiler]');
      solcWorker.postMessage({ type: 'loadModule', compilersource });
      console.timeEnd('[load compiler]');

      console.time('[wrap compiler]');
      solcWorker.postMessage({ type: 'wrapCompiler', version, url, solc });
      console.timeEnd('[wrap compiler]');
    }
    try {
      await solcjsCore.pretest(newCompile, version);
      newEvent.emit('compile', newCompile);
    } catch (err) {
      // throw new Error('pretest failed');
      newEvent.emit('error', err);
    }
  } catch (error) {
    console.error(error);
    // reject(error);
    newEvent.emit('error', error);
  }
}

module.exports = solcjs;
