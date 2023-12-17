const fs = require('fs/promises');
const util = require('node:util');
const { tmpdir } = require('node:os');
const path = require('node:path');

const errorCodes = require('./error-codes');

const exec = util.promisify(require('node:child_process').exec);

/**
 * @typedef DnsRecordItem
 * @type {object}
 *
 * @property {number} ttl
 * @property {string} type
 * @property {string} class
 * @property {string} name
 * @property {string} data
 */

/**
 * @typedef MassDnsResultData
 * @type {object}
 *
 * @property {DnsRecordItem[]} [answers]
 * @property {DnsRecordItem[]} [authorities]
 */

/**
 * @typedef MassDnsResultItem
 * @type {object}
 *
 * @property {string} name
 * @property {string} type
 * @property {string} class
 * @property {string} status
 * @property {number} rx_ts
 * @property {MassDnsResultData} data
 * @property {string[]} flags
 * @property {string} resolver
 * @property {string} proto
 */

/**
 * @typedef MassDNSOptions
 * @type {object}
 *
 * @property {string} [bin] - massdns binary file to use, will use "massdns" from $PATH if not specified
 * @property {string[]} [resolvers] - resolvers to use, ignored if resolverFile option specifed
 * @property {string} [resolverFile] - file containing resolvers, will override resolvers option
 * @property {string} [tempDir] - temp dir, will use temp dir from OS if not specified
 * @property {boolean} [preserveTempDir] - do not delete temp dir at end, default to true if tempDir specified and false if tempDir not specified
 * @property {string} [logFile] - massdns log file
 * @property {number} [hashMapSize] - optional number of concurent lookup, will use massdns default if not specified (10000)
 */

/**
 * Call massdns
 *
 * @param {string[]} hostnames
 * @param {MassDNSOptions} [options] - at lease specify resolvers or resolverFile
 * @returns {Promise<MassDnsResultItem[]>}
 */
module.exports = async (hostnames, options) => {
  const tempDir = options?.tempDir || await fs.mkdtemp(path.join(tmpdir(), 'node-massdns-'));

  let resolverFile = options?.resolverFile;
  if (!resolverFile) {
    if (!Array.isArray(options?.resolvers) || !options.resolvers.length) {
      const e = new Error(errorCodes.NODE_MASSDNS_EMPTY_RESOLVERS);
      e.code = errorCodes.NODE_MASSDNS_EMPTY_RESOLVERS;
      throw e;
    }

    try {
      resolverFile = path.join(tempDir, 'resolvers.txt');
      await fs.writeFile(resolverFile, options.resolvers.join('\n'));
    } catch (e) {
      const newE = new Error(errorCodes.NODE_MASSDNS_EXCEPTION_ON_WRITING_RESOLVERS);
      newE.code = errorCodes.NODE_MASSDNS_EXCEPTION_ON_WRITING_RESOLVERS;
      newE.originalError = e;
      throw newE;
    }
  }

  const inputFile = path.join(tempDir, 'input.txt');
  const outFile = path.join(tempDir, 'output.ndjson');

  try {
    await fs.writeFile(inputFile, (hostnames || []).filter((item) => item).join('\n'));
  } catch (e) {
    const newE = new Error(errorCodes.NODE_MASSDNS_EXCEPTION_ON_WRITING_INPUT_FILE);
    newE.code = errorCodes.NODE_MASSDNS_EXCEPTION_ON_WRITING_INPUT_FILE;
    newE.originalError = e;
    throw newE;
  }

  const logFile = options?.logFile || path.join(tempDir, 'massdns.log');

  const cmdItems = [
    options?.bin || 'massdns',
    '-q',
    `-r ${resolverFile}`,
    '-o J',
    `--outfile ${outFile}`,
    `-l ${logFile}`,
    inputFile
  ];

  try {
    await exec(cmdItems.join(' '));

    const result = [];

    (await fs.readFile(outFile))
      .toString()
      .trim()
      .split(/\s*\n\s*/)
      .filter((line) => line)
      .map((line) => JSON.parse(line))
      .map((line) => result.push(line));

    // destroy temp dir if tempDir and preserveTempDir not specified by caller
    if (!options?.tempDir && !options?.preserveTempDir) {
      await fs.rm(tempDir, { recursive: true });
    }

    return result;
  } catch (e) {
    const newE = new Error(errorCodes.NODE_MASSDNS_EXCEPTION);
    newE.code = errorCodes.NODE_MASSDNS_EXCEPTION;
    newE.originalError = e;
    newE.pwd = process.cwd();

    throw newE;
  }
};
