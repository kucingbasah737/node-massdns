# node-massdns

[![Version npm](https://img.shields.io/npm/v/massdns.svg)](https://www.npmjs.com/package/massdns)
[![Npm package total downloads](https://img.shields.io/npm/dt/massdns)](https://npmjs.com/package/massdns)
![Visitors](https://api.visitorbadge.io/api/combined?path=https%3A%2F%2Fgithub.com%2Fkucingbasah737%2Fnode-massdns&countColor=%234cc71e&style=flat)
[![node.js version](https://img.shields.io/node/v/massdns)](https://www.npmjs.com/package/massdns)
[![Module type: CJS](https://img.shields.io/badge/module%20type-cjs-brightgreen)](https://github.com/voxpelli/badges-cjs-esm)
[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg)](https://github.com/standard/semistandard)
[![jsDocs.io](https://img.shields.io/badge/jsDocs.io-reference-blue)](https://www.jsdocs.io/package/jsdoc)
[![Unit test status](https://github.com/kucingbasah737/node-massdns/actions/workflows/node.js.yml/badge.svg)](https://github.com/kucingbasah737/node-massdns/actions/workflows/node.js.yml?query=branch%3Amain)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/massdns)
![npm bundle size](https://img.shields.io/bundlephobia/min/massdns)
[![License](https://img.shields.io/github/license/kucingbasah737/node-massdns)](https://github.com/kucingbasah737/node-massdns/blob/main/LICENSE)

[MassDNS]((https://github.com/blechschmidt/massdns)) wrapper for node.js

- [node-massdns](#node-massdns)
  - [What is MassDNS](#what-is-massdns)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Result example](#result-example)
      - [massdns](#massdns)
      - [lookup('www.gihub.com', massdnsResults)](#lookupwwwgihubcom-massdnsresults)
    - [returnAsKeyValueObject option](#returnaskeyvalueobject-option)
  - [Known issues](#known-issues)
  - [Changelog](#changelog)
  - [See also](#see-also)

## What is MassDNS
Quoted from [MassDNS github](https://github.com/blechschmidt/massdns):

MassDNS is a simple high-performance DNS stub resolver targeting those who seek to resolve a massive amount of domain names in the order of millions or even billions. Without special configuration, MassDNS is capable of resolving over 350,000 names per second using publicly available resolvers.

## Requirements
- node.js >= v16.x
- [massdns binary](https://github.com/blechschmidt/massdns)
  Tested using up-to-date master branch and latest release (massdns v1.0.0)
- File containing list of resolvers to use.
  You can use file generated by [get-resolvers.py](https://github.com/blechschmidt/massdns/blob/master/scripts/get-resolvers.sh) script from MassDNS.

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
  lookup('www.github.com', massdnsResults);
})();

```

### Result example

#### massdns
```json
[
  {
    "name": "example.org.",
    "type": "A",
    "class": "IN",
    "status": "NOERROR",
    "rx_ts": 1703233801103924700,
    "data": {
      "answers": [
        {
          "ttl": 1633,
          "type": "A",
          "class": "IN",
          "name": "example.org.",
          "data": "93.184.216.34"
        }
      ]
    },
    "flags": [
      "rd",
      "ra"
    ],
    "resolver": "8.8.4.4:53",
    "proto": "UDP"
  },
  {
    "name": "www.example.org.",
    "type": "A",
    "class": "IN",
    "status": "NOERROR",
    "rx_ts": 1703233801108079900,
    "data": {
      "answers": [
        {
          "ttl": 15373,
          "type": "A",
          "class": "IN",
          "name": "www.example.org.",
          "data": "93.184.216.34"
        }
      ]
    },
    "flags": [
      "rd",
      "ra"
    ],
    "resolver": "8.8.4.4:53",
    "proto": "UDP"
  },
  {
    "name": "www.github.com.",
    "type": "A",
    "class": "IN",
    "status": "NOERROR",
    "rx_ts": 1703233801111802600,
    "data": {
      "answers": [
        {
          "ttl": 3487,
          "type": "CNAME",
          "class": "IN",
          "name": "www.github.com.",
          "data": "github.com."
        },
        {
          "ttl": 60,
          "type": "A",
          "class": "IN",
          "name": "github.com.",
          "data": "140.82.112.3"
        }
      ]
    },
    "flags": [
      "rd",
      "ra"
    ],
    "resolver": "8.8.4.4:53",
    "proto": "UDP"
  },
  {
    "name": "asd.am21l32ml2.com.",
    "type": "A",
    "class": "IN",
    "status": "NXDOMAIN",
    "rx_ts": 1703233801120768500,
    "data": {
      "authorities": [
        {
          "ttl": 900,
          "type": "SOA",
          "class": "IN",
          "name": "com.",
          "data": "a.gtld-servers.net. nstld.verisign-grs.com. 1703233784 1800 900 604800 86400"
        }
      ]
    },
    "flags": [
      "rd",
      "ra"
    ],
    "resolver": "8.8.4.4:53",
    "proto": "UDP"
  }
]
```

#### lookup('www.gihub.com', massdnsResults)
```json
[
  {
    "ttl": 3487,
    "type": "CNAME",
    "class": "IN",
    "name": "www.github.com.",
    "data": "github.com."
  },
  {
    "ttl": 60,
    "type": "A",
    "class": "IN",
    "name": "github.com.",
    "data": "140.82.112.3"
  }
]
```

### returnAsKeyValueObject option
Looking up item on big array is inefficient. For processing big result, consider to use "returnAsKeyValueObject" options.
Return value will be a key-value object so you can lookup easily without "lookup" method in more efficient.

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
      ],
      returnAsKeyValueObject: true
    }
  );
})();

```

Will return:
```json
{
  "example.org.": {
    "name": "example.org.",
    "type": "A",
    "class": "IN",
    "status": "NOERROR",
    "rx_ts": 1703233801103924700,
    "data": {
      "answers": [
        {
          "ttl": 1633,
          "type": "A",
          "class": "IN",
          "name": "example.org.",
          "data": "93.184.216.34"
        }
      ]
    },
    "flags": [
      "rd",
      "ra"
    ],
    "resolver": "8.8.4.4:53",
    "proto": "UDP"
  },
  "www.github.com": {
    "name": "www.github.com.",
    "type": "A",
    "class": "IN",
    "status": "NOERROR",
    "rx_ts": 1703233801111802600,
    "data": {
      "answers": [
        {
          "ttl": 3487,
          "type": "CNAME",
          "class": "IN",
          "name": "www.github.com.",
          "data": "github.com."
        },
        {
          "ttl": 60,
          "type": "A",
          "class": "IN",
          "name": "github.com.",
          "data": "140.82.112.3"
        }
      ]
    },
    "flags": [
      "rd",
      "ra"
    ],
    "resolver": "8.8.4.4:53",
    "proto": "UDP"
  }
}
```

## Known issues
MassDNS is very fast and has very little memory footprint. But using this wrapper might produce high memory usage
(around 400-500 MB for 100k hostnames) because this wrapper wraps the result in ready to use json so you can traverse
it just like a standard array of object in javascript. Passing big object on javascript would also have big impact,
but I think it's still acceptable on my use.

I have consider to pass result as file (not passing result as array of object values),
but I think it just defeat our goal to provide easy to access MassDNS result.

Let me know if you have any consideration or recomendation. Please raise an issue.
I will very happy if there is someone has interest and care of this package.

If you want to lookup on big result, use returnAsKeyValueObject option. It will improve lookup speed dramatically.

## Changelog
See [CHANGELOG.md](CHANGELOG.md) file.

## See also
- [node-crtsh](https://github.com/kucingbasah737/node-crtsh): query crt.sh from node.js
