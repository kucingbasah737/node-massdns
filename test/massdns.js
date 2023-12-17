/* global describe, it, before */

require('should');
const path = require('node:path');
const fs = require('node:fs/promises');

const hostnames = [
  // positive test
  'example.org',
  'www.example.org',
  'www.github.com',

  // negative test
  'asd.am21l32ml2.com'
];

const { massdns, lookup } = require('../src');

describe('#massdns', () => {
  /**
   * @type {import('../src/massdns').MassDnsResultItem[]}
   */
  let result;

  /**
   * @type {import('../src/massdns').MassDnsResultItem[]}
   */
  let resultUsingResolversOption;

  /**
   * @type {string[]}
   */
  let resolvers;

  before(async () => {
    const bin = path.join(__dirname, '..', 'test-data', 'massdns');
    const resolverFile = path.join(__dirname, '..', 'test-data/resolvers.txt');

    try {
      result = await massdns(
        hostnames,
        {
          bin,
          resolverFile
        }
      );

      resolvers = (await fs.readFile(resolverFile)).toString().split('\n');
      resultUsingResolversOption = await massdns(['example.org'], { bin, resolvers });
    } catch (e) {
      console.warn('Exception');
      console.warn('E.CODE: ', e.code);
      console.warn('E.MESSAGE: ', e.message || e.toString);
      console.warn('');
      console.warn('ORIGINAL E.CODE: ', e.originalError?.code);
      console.warn('ORIGINAL E.MESSAGE: ', e.originalError?.message || e.originalError?.toString());
      console.warn('');
      console.warn('PWD: ', e.pwd);
    }
  });

  describe('massdns', () => {
    it('should executed and return correct value', () => {
      Array.isArray(result).should.true('result is an array');

      result
        .find((item) => item.name === 'example.org.')
        .data.answers.filter((record) => record.type === 'A').length.should.greaterThan(0, 'example.org has A record');

      result
        .find((item) => item.name === 'www.github.com.')
        .data.answers.filter((record) => record.type === 'CNAME').length.should.equal(1, 'www.github.com has CNAME record');
    });

    it('should be okay too when using resolvers option', async () => {
      Array.isArray(resultUsingResolversOption).should.true('result is an array');
    });
  });

  describe('lookup', () => {
    it('should lookup and return correct value', () => {
      lookup('example.org', result)
        .should.containDeep([{ name: 'example.org.', type: 'A' }]);

      lookup('www.github.com', result)
        .should.containDeep([{ type: 'CNAME', name: 'www.github.com.' }, { type: 'A' }]);

      lookup('asd.am21l32ml2.com', result)
        .length.should.equal(0);
    });
  });
});
