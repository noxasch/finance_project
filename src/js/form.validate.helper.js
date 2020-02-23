'use strict';

function formValidated(results) {
  // console.log(results);
  // console.log(results.amount);
  if (results.amount === '' || results.amount === '0' ||
    results.amount === undefined || parseFloat(results.amount) === 0.00 ||
    isNaN(parseFloat(results.amount))) {
    return false;
  }
  return true;
}

module.exports = {
  formValidated
}