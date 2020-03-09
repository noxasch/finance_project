'use strict';

function validateAmount(results) {
  // console.trace(results);

  switch (results['transaction-type']) {
    case '0':
      if (results['amount-from'] === '' || results['amount-from'] === '0' ||
        results['amount-from'] === undefined || parseFloat(results['amount-from']) === 0.00 ||
        isNaN(parseFloat(results['amount-from']))) {
        return false;
      }
      break;
    case '1':
      if (results['amount-to'] === '' || results['amount-to'] === '0' ||
        results['amount-to'] === undefined || parseFloat(results['amount-to']) === 0.00 ||
        isNaN(parseFloat(results['amount-to']))) {
        return false;
      }
      break;
    case '2':
      if (results['amount-from'] === '' || results.amount === '0' ||
        results.amount === undefined || parseFloat(results.amount) === 0.00 ||
        isNaN(parseFloat(results.amount))) {
        return false;
      }
      if (results['amount-to'] === '' || results['amount-to'] === '0' ||
        results['amount-to'] === undefined || parseFloat(results['amount-to']) === 0.00 ||
        isNaN(parseFloat(results['amount-to']))) {
        return false;
      }
      break;
  }

  // validate date
  // if ()
  return true;
}

module.exports = {
  validateAmount
}