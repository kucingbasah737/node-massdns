/* global describe, it, before */

const path = require('node:path');
const should = require('should');
const { massdns } = require('../src');

const hostnames = [
  'example.org'
];

describe('#massdns using keyvalue retval', () => {
  let result;

  before(async () => {
    const bin = path.join(__dirname, '..', 'test-data', 'massdns');
    const resolverFile = path.join(__dirname, '..', 'test-data/resolvers.txt');
    result = await massdns(hostnames, {
      bin,
      resolverFile,
      returnAsKeyValueObject: true
    });
  });

  it('should return correct result', () => {
    Array.isArray(result).should.equal(false, 'result should not an array');
    should.exist(result['example.org.'], 'example.org key should exists');
  });
});
