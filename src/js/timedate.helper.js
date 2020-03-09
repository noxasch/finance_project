'use strict';

/**Convert to local currency 
     * @param {Number} value 
     */
function toLocaleFixed(value) {
  
  const digit = /\d+\.?\,?\d +/ig;
  const symbol = /[^0-9\.\,\s]+/ig

  return (value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  // from the output we gonna split the Currency Symbol and actual value
}

function toUnixTimeStamp(dateString) {
  return new Date(dateString).getTime() / 1000;
}

function fromUnixTimeStamp(unixtimestamp) {
  const dateOpts = { year: "numeric", month: "short", day: "numeric" };
  const date = Intl.DateTimeFormat(undefined, dateOpts).format(new Date(unixtimestamp * 1000).getTime());
  return date;
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
 * @param {string} a - transaction_date a
 * @param {string} b - transaction_date b
 */
function compareDate(a, b) {
  console.log(a, b);
  // consider comverting to unixtimestamp in case of performance degradation
  if (new Date(a.replace(/-/g, '/')) > new Date(b.replace(/-/g, '/'))) return -1;
  if (new Date(a.replace(/-/g, '/')) < new Date(b.replace(/-/g, '/'))) return 1;
  return 0;
}

module.exports = { 
  fromUnixTimeStamp,
  convertDate,
  compareDate,
  toUnixTimeStamp,
  toLocaleFixed
 };