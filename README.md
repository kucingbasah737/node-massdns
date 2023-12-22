# node-massdns

[![Version npm](https://img.shields.io/npm/v/massdns.svg)](https://www.npmjs.com/package/massdns)
[![Npm package total downloads](https://img.shields.io/npm/dt/massdns)](https://npmjs.com/package/massdns)
[![node.js version](https://img.shields.io/node/v/massdns)](https://www.npmjs.com/package/massdns)
[![Module type: CJS](https://img.shields.io/badge/module%20type-cjs-brightgreen)](https://github.com/voxpelli/badges-cjs-esm)
[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg)](https://github.com/standard/semistandard)
[![Unit test status](https://github.com/kucingbasah737/node-massdns/actions/workflows/node.js.yml/badge.svg)](https://github.com/kucingbasah737/node-massdns/actions/workflows/node.js.yml?query=branch%3Amain)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/massdns)
![npm bundle size](https://img.shields.io/bundlephobia/min/massdns)
[![License](https://img.shields.io/github/license/kucingbasah737/node-crtsh)](https://github.com/kucingbasah737/node-massdns/blob/main/LICENSE)

[MassDNS]((https://github.com/blechschmidt/massdns)) wrapper for node.js

- [node-massdns](#node-massdns)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Changelog](#changelog)
  - [See also](#see-also)

## Requirements
- node.js >= v16.x
- [massdns binary](https://github.com/blechschmidt/massdns)
  Tested using up-to-date master branch and latest release (massdns v1.0.0)

## Installation
```shell
npm i massdns
```

## Usage
```javascript
const { massdns, lookup } = require('massdns');

(async () => {
  const massdnsResults = await massdns(
    [
      'example.org',
      'www.github.com'
    ],
    {
      resolvers: [
        '8.8.8.8',
        '8.8.4.4',
        '1.1.1.1'
      ]
    }
  );

  lookup('example.org', massdnsResults);
  // will return like:
  // [
  //   {
  //     "ttl": 2095,
  //     "type": "A",
  //     "class": "IN",
  //     "name": "example.org.",
  //     "data": "93.184.216.34"
  //   }
  // ]

  lookup('www.github.com', massdnsResults);
  // will return like:
  // [
  //   {
  //     "ttl": 3199,
  //     "type": "CNAME",
  //     "class": "IN",
  //     "name": "www.github.com.",
  //     "data": "github.com."
  //   },
  //   {
  //     "ttl": 60,
  //     "type": "A",
  //     "class": "IN",
  //     "name": "github.com.",
  //     "data": "20.205.243.166"
  //   }
  // ]
})();

```

## Changelog
See [CHANGELOG.md](CHANGELOG.md) file.

## See also
- [node-crtsh](https://github.com/kucingbasah737/node-crtsh): query crt.sh from node.js
