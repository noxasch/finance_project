'use strict';

// TODO: add unit test for this

function isValidAmount(amount) {
  if (amount === '' || amount === '0' ||
    amount === undefined || parseFloat(amount) === 0.00 ||
    isNaN(parseFloat(amount))) {
    return false;
  }
  return true;
}

/**
 * Backend vaidation when form submit
 * @param {*} results 
 */
function validateAmount(results) {
  // console.log(results);

  switch (results['transaction-type']) {
    case '0':
      // if (results['amount-from'] === '' || results['amount-from'] === '0' ||
      //   results['amount-from'] === undefined || parseFloat(results['amount-from']) === 0.00 ||
      //   isNaN(parseFloat(results['amount-from']))) {
      //   return false;
      // }
      if (!isValidAmount(results['amount-from'])) return false;
      break;
    case '1':
      // if (results['amount-to'] === '' || results['amount-to'] === '0' ||
      //   results['amount-to'] === undefined || parseFloat(results['amount-to']) === 0.00 ||
      //   isNaN(parseFloat(results['amount-to']))) {
      //   return false;
      // }
      if (!isValidAmount(results['amount-to'])) return false;
      break;
    case '2':
      console.log(results);
      // if (results['amount-from'] === '' || results['amount-from'] === '0' ||
      //   results['amount-from'] === undefined || parseFloat(results['amount-from']) === 0.00 ||
      //   isNaN(parseFloat(results['amount-from']))) {
      //   return false;
      // }
      if (!isValidAmount(results['amount-from'])) return false;
      // if (results['amount-to'] === '' || results['amount-to'] === '0' ||
      //   results['amount-to'] === undefined || parseFloat(results['amount-to']) === 0.00 ||
      //   isNaN(parseFloat(results['amount-to']))) {
      //   return false;
      // }
      if (!isValidAmount(results['amount-to'])) return false;
      break;
  }

  // validate date
  // if ()
  return true;
}

module.exports = {
  validateAmount
}