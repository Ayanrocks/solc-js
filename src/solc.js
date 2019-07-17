const solcjsCore = require('solcjs-core');

function solcjs(_version) {
  return new Promise(async (resolve, reject) => {
    let newCompile;
    let version;
    let compilersource;
    let solc;
    let url;

    try {
      const solcWorker = new Worker('solcWorker.js');
      solcWorker.onmessage = data => {
        if (data.type == 'versions') {
          version = data.version;
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
