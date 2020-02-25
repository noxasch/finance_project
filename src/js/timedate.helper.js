'use strict';

/**Convert to local currency 
     * @param {Number} value 
     */
function toLocaleFixed(value) {
  return (value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function toUnixTimeStamp(dateString) {
  return new Date(dateString).getTime() / 1000;
}

/** @param {string} date - 2020-02-10 into 10 Feb 2020 */
function convertDate(date) {
  const dateOpts = { year: "numeric", month: "short", day: "numeric" };
  // const date = Intl.DateTimeFormat(undefined, dateOpts).format(new Date(unixtimestamp * 1000).getTime());
  // return date;
  date = date.replace(/-/g, '/');
  date = Intl.DateTimeFormat(undefined, dateOpts).format(new Date(date).getTime());
  return date;
}

/**
 * reverse the dummy model order
 * @param {string} a - datetime a
 * @param {string} b - datetime b
 */
function compareDate(a, b) {
  // consider comverting to unixtimestamp in case of performance degradation
  if (new Date(a.replace(/-/g, '/')) > new Date(b.replace(/-/g, '/'))) return -1;
  if (new Date(a.replace(/-/g, '/')) < new Date(b.replace(/-/g, '/'))) return 1;
  return 0;
}

module.exports = { 
  // TransactionHelper,
  convertDate,
  compareDate,
  toUnixTimeStamp,
  toLocaleFixed
 };