# node-massdns

[![Module type: CJS](https://img.shields.io/badge/module%20type-cjs-brightgreen)](https://github.com/voxpelli/badges-cjs-esm)
[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg)](https://github.com/standard/semistandard)
[![License](https://img.shields.io/github/license/kucingbasah737/node-crtsh)](https://github.com/kucingbasah737/node-massdns/blob/main/LICENSE)

[MassDNS]((https://github.com/blechschmidt/massdns)) wrapper for node.js

- [node-massdns](#node-massdns)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Usage](#usage)
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
  const massdnsResults = await massdns(['example.org', 'www.github.com'], { resolvers: ['8.8.8.8', '8.8.4.4', '1.1.1.1'] });

  lookup('example.org', massdnsResults);
  lookup('www.github.com', massdnsResults);
})();

```
## See also
- [node-crtsh](https://github.com/kucingbasah737/node-crtsh): query crt.sh from node.js
