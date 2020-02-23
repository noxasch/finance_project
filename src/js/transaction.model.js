'use strict';

module.exports.transactionType = ['expense', 'income', 'transfer'];
module.exports.operationType = ['withdrawal', 'deposit'];

console.log('Transaction Model');

const transactionModel = (function () {
  const state = {
    totalBalance: 0,
    currentItem: null
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
      state.currentItem = item;
    },

    getCurrentItem: function () {
      return state.currentItem;
    },

    deleteCurrentItem: function () {
      state.currentItem = null;
    }
  }
})();

module.exports.transactionModel = transactionModel;