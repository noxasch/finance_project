'use strict';
// store account state
// use in index:home transction list
// and should be use in transaction list
const Transaction = (function () {
  let currentItem = {
    id: null,
    transfer_id: null,
  }

  function sumAmount(s) { // parse string equation
    return (s.replace(/\s/g, '').match(/[+\-]?([0-9\.]+)/g) || [])
      .reduce(function (sum, value) {
        return parseFloat(sum) + parseFloat(value);
      }
      );
  }

  return {
    getTotalBalance: function (transactions = null) {
      if (transactions) {
        let equation = '0';
        transactions.forEach((ops) => {
          if (ops.operation == 0) equation += ` - ${ops.amount}`;
          if (ops.operation == 1) equation += ` + ${ops.amount}`;
        });
        state.totalBalance = sumAmount(equation);
      }
      // console.log(state.totalBalance);
      return state.totalBalance;
    },

    setCurrentItem: function (item) {
      currentItem = item;
    },

    getCurrentItem: function () {
      return currentItem
    },

    deleteCurrentItem: function () {
      currentItem = {
        id: null,
        transfer_id: null,
      }
    }
  }
})();

module.exports = Transaction;