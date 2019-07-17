const solcVersion = require('solc-version');
const getCompile = require('./getCompile');
const solcjsCore = require('solcjs-core');
const solcWrapper = solcjsCore.solcWrapper.wrapper;

onmessage = async e => {
  if (e.type == 'getVersions') {
    const version = await solcjsCore.getVersion(e._version);
    postMessage({ type: 'versions', version });
  }

  if (e.type == 'version2url') {
    let url = await solcVersion.version2url(e.version);
    let compilersource = await solcjsCore.getCompilersource(url);
    postMessage({ type: 'version2url', compilersource, url });
  }

  if (e.type == 'loadModule') {
    const solc = solcjsCore.loadModule(e.compilersource);
    postMessage({ type: 'loadModule', solc });
  }

  if (e.type == 'wrapCompiler') {
    let _compiler = solcWrapper(e.solc);
    _compiler.opts = { version: e.version, url: e.url };

    let newCompile = getCompile(_compiler);
    newCompile.version = { name: e.version, url: e.url };
    postMessage({ type: 'wrapCompiler', newCompile });
  }
};
