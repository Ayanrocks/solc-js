const solcVersion = require('solc-version');
const getCompile = require('./getCompile');
const solcjsCore = require('solcjs-core');
const solcWrapper = solcjsCore.solcWrapper.wrapper;

function solcjs(_version) {
  return new Promise(async (resolve, reject) => {
    let newCompile;
    let version;
    let compilersource;
    let solc;
    const solcWorker = new Worker('./solcWorker.js');
    solcWorker.onmessage = data => {
      if (data.type == 'versions') {
        version = data.version;
      }
      if (data.type == 'version2url') {
        compilersource = data.compilersource;
      }

      if (data.type == 'loadModule') {
        solc = data.solc;
      }
    };

    try {
      // version = await solcjsCore.getVersion(_version);
      solcWorker.postMessage({ type: 'getVersions', _version });
      console.time('[fetch compiler]');
      solcWorker.postMessage({ type: 'version2url', version });
      console.timeEnd('[fetch compiler]');

      console.time('[load compiler]');
      solcWorker.postMessage({ type: 'loadModule', compilersource });
      console.timeEnd('[load compiler]');

      console.time('[wrap compiler]');
      let _compiler = solcWrapper(solc);
      _compiler.opts = { version, url };

      newCompile = getCompile(_compiler);
      newCompile.version = { name: version, url };
      console.timeEnd('[wrap compiler]');

      try {
        await solcjsCore.pretest(newCompile, version);
        resolve(newCompile);
      } catch (err) {
        throw new Error('pretest failed');
      }
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}

module.exports = solcjs;
