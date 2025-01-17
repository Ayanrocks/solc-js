# solc-js
cross-browser solidity compiler for the web

![Travis](https://img.shields.io/travis/ethereum-play/solc-js.svg)
[![codecov](https://codecov.io/gh/ethereum-play/solc-js/branch/master/graph/badge.svg)](https://codecov.io/gh/alincode/ethereum-play/solc-js)![npm downloads](https://img.shields.io/npm/dt/ethereum-play/solc-js.svg)
[![Dependency Status](https://img.shields.io/david/ethereum-play/solc-js.svg?style=flat)](https://david-dm.org/ethereum-play/solc-js)

**smaller and faster alternative to [solc](https://www.npmjs.com/package/solc) for browser-only environments**
* JavaScript bindings for the [solidity compiler](https://github.com/ethereum/solidity)
* Uses the emscripten compiled solidity found in the [solc-bin repository](https://github.com/ethereum/solc-bin)

In nodejs you can instead use [solc](https://www.npmjs.com/package/solc) or [solc-native](https://www.npmjs.com/package/solc-native)

### Install

```sh
npm install solc-js
```

### Usage

```js
const solcjs = require('solc-js')
```
**await solcjs(version)**

```js
const version = 'v0.5.1-stable-2018.12.03'
const compiler = await solcjs(version)

// or

// const compiler = await solcjs()

const sourceCode = `
  pragma solidity >0.4.99 <0.6.0;

  library OldLibrary {
    function someFunction(uint8 a) public returns(bool);
  }

  contract NewContract {
    function f(uint8 a) public returns (bool) {
        return OldLibrary.someFunction(a);
    }
  }`
const output = await compiler(sourceCode)
```

**await solcjs(version).version**

```js
const version = 'v0.4.25-stable-2018.09.13'
const compiler = await solcjs(version)
console.dir(compiler.version)
// { name: 'v0.4.25-stable-2018.09.13',
// url: 'https://solc-bin.ethereum.org/bin/soljson-v0.4.25+commit.59dbf8f1.js' }
```

**await solcjs.versions()**

```js
const select = await solcjs.versions()

const { releases, nightly, all } = select
console.log(releases[0])
// v0.4.25-stable-2018.09.13
```
<!--
```js
const list = ''
const select = await solcjs.versions(list)

const { releases, nightly, all } = select
console.log(releases[0])
``` -->

**await solcjs.version2url(version)**

```js
const version = 'v0.4.25-stable-2018.09.13'
const url = await solcjs.version2url(version)
console.log(url)
// https://solc-bin.ethereum.org/bin/soljson-v0.4.25+commit.59dbf8f1.js
```

```js
const version = 'latest'
const url = await solcjs.version2url(version)
console.log(url)
// https://solc-bin.ethereum.org/bin/soljson-v0.1.1+commit.6ff4cd6.js
```

**await compiler(sourceCode)**

```js
const compiler = await solcjs()

const sourceCode = `
  library OldLibrary {
      function someFunction(uint8 a) public returns(bool);
  }

  contract NewContract {
      function f(uint8 a) public returns (bool) {
          return OldLibrary.someFunction(a);
      }
  }`

const output = await compiler(sourceCode)
```

```js
const compiler = await solcjs()

const sourceCode = `
  import 'https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/math/SafeMath.sol';

  library OldLibrary {
      function someFunction(uint8 a) public returns(bool);
  }

  contract NewContract {
      function f(uint8 a) public returns (bool) {
          return OldLibrary.someFunction(a);
      }
  }`

const output = await compiler(sourceCode)
```

**await compiler(sourceCode, getImportContent)**

```js
const version = 'v0.5.1-stable-2018.12.03'
const compiler = await solcjs(version)
const solcResolver = require('solc-resolver')

const sourceCode = `
  pragma solidity >0.4.99 <0.6.0;

  import "lib.sol";

  library OldLibrary {
    function someFunction(uint8 a) public returns(bool);
  }

  contract NewContract {
    function f(uint8 a) public returns (bool) {
        return OldLibrary.someFunction(a);
    }
  }`

const store = new Map()
store.set('lib.sol', 'library L { function f() internal returns (uint) { return 7; } }')

const ResolverEngine = require('solc-resolver').resolverEngine;
let resolveGithub = require('resolve-github');
let resolveIpfs = require('resolve-ipfs');
let resolveHttp = require('resolve-http');

let resolverEngine = new ResolverEngine();
resolverEngine.addResolver(resolveGithub);
resolverEngine.addResolver(resolveIpfs);
resolverEngine.addResolver(resolveHttp);

const getImportContent = async function (path) {
  return myDB.has(path) ? myDB.get(path) : await resolverEngine.require(path);
};

const output = await compiler(sourceCode, async (path) => {
return store.has(path) ? store.get(path) : await resolverEngine.require(path))
}
```

### Standard Output Format

```js
{
  "abi": [{…}, {…}],
  "contractName": "SimpleStorage",
  "errors": [{…}],
  "metadata": {compiler: {…}, language: "Solidity", output: {…}, settings: {…}, sources: {…}, …},
  "success": true,
  "version": "0.5.0+commit.1d4f565a"
}
```

### Relevant Projects

* [solc-import](https://github.com/alincode/solc-import)
* [solc-resolver](https://github.com/alincode/solc-resolver)
* [solc-version](https://github.com/alincode/solc-version)
* [solcjs-core](https://github.com/alincode/solcjs-core)

### contribute
feel free to make pull requests or file issues [here](https://github.com/ethereum/play/issues)
