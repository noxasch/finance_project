'use strict';

const { TransactionHelper } = require('./transaction.helper');
const { transactionType } = require('./model');


module.exports.TransactionInput = (function () {
  const UISelectors = {
    form: 'update-transaction-form',
    transactionInput: 'transaction-input',
    accountFrom: 'account-input-from',
    accountTo: 'account-input-to',
    dateInput: 'date-input',
    amountInput: 'amount-input',
    labelInput: 'label-input',
    categoryInput: 'category-input'
  }

  /**
   * Constructor
   * @param {string} key 
   * @param {string} value 
   */
  const setSelectors = function (selectors) {
    UISelectors = selectors;
  }

  function formValidated(results = {}) {
    // console.log(results);
    // console.log(results.amount);
    if (results.amount === '' || results.amount === undefined) {
      document.getElementById('amount-input').setCustomValidity('amount cannot be empty.');
      document.getElementById('amount-input').reportValidity();
      return false;
    }
    return true;
  }

  function hideAccountTo() {
    document.getElementById(UISelectors.accountTo).parentElement.classList.add('hide');
    document.getElementById(UISelectors.accountTo).setAttribute('disabled', true);
  }

  function showAccountTo() {
    document.getElementById(UISelectors.accountTo).parentElement.classList.remove('hide');
    document.getElementById(UISelectors.accountTo).removeAttribute('disabled');
  }

  function hideAccountFrom() {
    document.getElementById(UISelectors.accountFrom).parentElement.classList.add('hide');
    document.getElementById(UISelectors.accountFrom).setAttribute('disabled', true);
  }

  function showAccountFrom() {
    document.getElementById(UISelectors.accountFrom).parentElement.classList.remove('hide');
    document.getElementById(UISelectors.accountFrom).removeAttribute('disabled');
  }

  return {
    setSelectors: setSelectors,
    setTodaysDate: function () {
      const today = Date.now() - (new Date()).getTimezoneOffset() * 60000;
      const dateInput = document.getElementById(UISelectors.dateInput);
      dateInput.valueAsNumber = today;
    },

    resetTransactionOption: function () {
      const transactionOption = document.getElementById(UISelectors.transactionInput);
      while (transactionOption.firstChild) transactionOption.removeChild(transactionOption.firstChild);
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < transactionType.length; i++) {
        let option = document.createElement('option');
        if (i === 0) option.selected = true;
        option.value = i;
        option.innerText = transactionType[i];
        fragment.appendChild(option)
      }
      transactionOption.append(fragment);
      hideAccountTo();
    },

    addTransactionOptionListener: function (fn = null) {
      document.getElementById(UISelectors.transactionInput).addEventListener('change', (e) => {
        if (e.target.value === '0') {
          showAccountFrom();
          hideAccountTo();
        }
        if (e.target.value === '1') {
          showAccountTo();
          hideAccountFrom();
        }
        if (e.target.value === '2') {
          showAccountFrom();
          showAccountTo();
          if (fn) {
            fn.call();
          }
        }
      });
    },

    addAmountInputListener: function () {
      document.getElementById(UISelectors.amountInput).addEventListener('keyup', (e) => {
        if (/[\d\.]+/i.test(e.target.value)) {
          const num = TransactionHelper.toLocaleFixed(parseFloat(e.target.value.replace(/\,/g, '')));
          const start = e.target.selectionStart;
          const end = e.target.selectionEnd;
          e.target.value = num;
          e.target.setSelectionRange(start, end);
          e.target.setCustomValidity('');
        }
        else if (/[A-Za-z]/i.test(e.target.value)) {
          e.target.setCustomValidity('Amount can only be numbers');
        }
      });
    }
  }
})();


