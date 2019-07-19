const solc = require('../src/');

require('jsdom-worker');
const fs = require('fs');
const path = require('path');
const code = fs.readFileSync(path.join(__dirname + '/../src/index.js'));

describe('solc EventEmitter', () => {
  it('await solcjs() - get latest compiler', async () => {
    const compiler = await solc();
    expect(compiler).toBe('function');
  });

  it('returns result from worker', () => {
    var link = document.createElement('link');
    link.rel = 'script';
    link.href = window.URL.createObjectURL(new Blob([code]));
    document.body.appendChild(link);
    expect(document.body.childNodes.length).toBeGreaterThan(0);
    const solcWorker = new Worker(link.href);

    solcWorker.onmessage = data => {
      if (data.type == 'versions') {
        expect(data.version).toBe(true);
      }
      if (data.type == 'version2url') {
        expect(data.compilersource).toBe(
          'https://solc-bin.ethereum.org/bin/soljson-v0.4.25+commit.59dbf8f1.js'
        );
      }

      if (data.type == 'loadModule') {
        let item = data.solc[0];
        item.should.have.all.keys(
          'name',
          'abi',
          'sources',
          'compiler',
          'assembly',
          'binary',
          'metadata'
        );
        item.metadata.analysis.should.have.all.keys('warnings', 'others');
        expect(data.solc).toBe(true);
      }
      if (data.type == 'wrapCompiler') {
        expect(data.newCompile).toBe(true);
      }
    };

    solcWorker.postMessage({ type: 'getVersions', _version });
    console.time('[fetch compiler]');
    let version = 'v0.4.25-stable-2018.09.13';

    solcWorker.postMessage({ type: 'version2url', version });
    console.timeEnd('[fetch compiler]');

    console.time('[load compiler]');

    const compilersource = `
    pragma solidity >0.4.99 <0.6.0;

    import 'https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/math/SafeMath.sol';

    library OldLibrary {
      function someFunction(uint8 a) public returns(bool);
    }

    contract NewContract {
      function f(uint8 a) public returns (bool) {
          return OldLibrary.someFunction(a);
      }
    }`;
    solcWorker.postMessage({ type: 'loadModule', compilersource });
    console.timeEnd('[load compiler]');

    console.time('[wrap compiler]');
    solcWorker.postMessage({ type: 'wrapCompiler', version, url, solc });
    console.timeEnd('[wrap compiler]');
  });
});
