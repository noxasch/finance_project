'use strict';

const TransactionHelper = (function () {
  return {
    /** @param {Number} value */
    toLocaleFixed: function (value) {
      return (value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },

    toUnixTimeStamp: function (dateString) {
      return new Date(dateString).getTime() / 1000;
    },

    /** @param {string} date - 2020-02-10 into 10 Feb 2020 */
    convertDate: function (date) {
      const dateOpts = { year: "numeric", month: "short", day: "numeric" };
      // const date = Intl.DateTimeFormat(undefined, dateOpts).format(new Date(unixtimestamp * 1000).getTime());
      // return date;
      date = date.replace(/-/g, '/');
      date = Intl.DateTimeFormat(undefined, dateOpts).format(new Date(date).getTime());
      return date;
    },

    /**
     * @param {*} a - datetime a
     * @param {*} b - datetime b
     * reverse order
     */
    compareDate: function (a, b) {
      // consider comverting to unixtimestamp in case of performance degradation
      if (new Date(a.replace(/-/g, '/')) > new Date(b.replace(/-/g, '/'))) return -1;
      if (new Date(a.replace(/-/g, '/')) < new Date(b.replace(/-/g, '/'))) return 1;
      return 0;
    }

  }
})()

module.exports = { TransactionHelper };