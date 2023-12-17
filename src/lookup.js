/**
 * Lookup hostname answer from massdns result
 *
 * @param {string} hostname
 * @param {import("./massdns").MassDnsResultItem[]} massdnsResult
 * @returns {import("./massdns").DnsRecordItem[]}
 */
module.exports = (hostname, massdnsResult) => {
  const resultItem = massdnsResult.find((item) => item.name === `${hostname}.`.replace(/\.+$/, '.'));
  if (!resultItem) return [];

  return (resultItem?.data?.answers || [])
    .filter((item) => item);
};
