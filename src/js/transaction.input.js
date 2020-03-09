'use strict';

const { toLocaleFixed  } = require('./timedate.helper');
const { transactionType } = require('./constant');
const { category } = require('./constant');


module.exports.TransactionInputUI = (function () {
  let state = null;
  let accountStore = null;
  const UISelectors = {
    transactionType: 'transaction-type',
    accountFrom: 'account-from',
    amountFrom: 'amount-from',
    accountTo: 'account-to',
    amountTo: 'amount-to',
    label: 'label-input',
    date: 'date-input',
    categorySelect: 'category-input',
    form: 'transaction-form', // handled by specific view
    cancelBtn: 'cancel', // this handled by update.window.js
    ex_rate: 'exrate'
  }

  function validateAndConvertToMoney(e) {
    if (/[\d\.]+/i.test(e.target.value)) {
      const num = toLocaleFixed(parseFloat(e.target.value.replace(/\,/g, '')));
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      e.target.value = num;
      e.target.setSelectionRange(start, end);
      e.target.setCustomValidity('');
    }
    else if (/[A-Za-z]/i.test(e.target.value)) {
      e.target.setCustomValidity('Amount can only be numbers');
    }
  }

  function hideAccountTo() {
    document.getElementById(UISelectors.accountTo).parentElement.parentElement.classList.add('hide');
    document.getElementById(UISelectors.amountTo).parentElement.classList.add('hide');
    document.getElementById(UISelectors.accountTo).setAttribute('disabled', true);
    document.getElementById(UISelectors.amountTo).setAttribute('disabled', true);
  }

  function showAccountTo() {
    document.getElementById(UISelectors.accountTo).parentElement.parentElement.classList.remove('hide');
    document.getElementById(UISelectors.amountTo).parentElement.classList.remove('hide');
    document.getElementById(UISelectors.accountTo).removeAttribute('disabled');
    document.getElementById(UISelectors.amountTo).removeAttribute('disabled');
  }

  function hideAccountFrom() {
    document.getElementById(UISelectors.accountFrom).parentElement.parentElement.classList.add('hide');
    document.getElementById(UISelectors.amountFrom).parentElement.classList.add('hide');
    document.getElementById(UISelectors.accountFrom).setAttribute('disabled', true);
    document.getElementById(UISelectors.amountFrom).setAttribute('disabled', true);
  }

  function showAccountFrom() {
    document.getElementById(UISelectors.accountFrom).parentElement.parentElement.classList.remove('hide');
    document.getElementById(UISelectors.amountFrom).parentElement.classList.remove('hide');
    document.getElementById(UISelectors.accountFrom).removeAttribute('disabled');
    document.getElementById(UISelectors.amountFrom).removeAttribute('disabled');
  }

  function hideLabel() {
    document.getElementById(UISelectors.label).parentElement.classList.add('hide');
    document.getElementById(UISelectors.label).setAttribute('disabled', true);
  }

  function showLabel() {
    document.getElementById(UISelectors.label).parentElement.classList.remove('hide');
    document.getElementById(UISelectors.label).removeAttribute('disabled');
  }

  function hideCategory() {
    document.getElementById(UISelectors.categorySelect).parentElement.parentElement.classList.add('hide');
    document.getElementById(UISelectors.categorySelect).setAttribute('disabled', true);
  }

  function showCategory() {
    document.getElementById(UISelectors.categorySelect).parentElement.parentElement.classList.remove('hide');
    document.getElementById(UISelectors.categorySelect).removeAttribute('disabled');
  }

  function showExchangeRate() {
    document.getElementById(UISelectors.ex_rate).parentElement.classList.remove('hide');
    document.getElementById(UISelectors.ex_rate).removeAttribute('disabled');
  }

  function hideExchangeRate() {
    document.getElementById(UISelectors.ex_rate).parentElement.classList.add('hide');
    document.getElementById(UISelectors.ex_rate).setAttribute('disabled', true);
  }

  function updateAccountFrom(data) {
    const select = document.getElementById(UISelectors.accountFrom);
    while (select.firstChild) select.removeChild(select.firstChild);
    let fragment = document.createDocumentFragment();
    data.forEach((item) => {
      // console.trace(item);
      const opt = document.createElement('option');
      opt.value = item.id;
      opt.textContent = item.name;
      fragment.appendChild(opt);
      // <option value="1">Bank A</option>
    });
    select.appendChild(fragment);
  }

  function updateAccountTo(data) {
    const select = document.getElementById(UISelectors.accountTo)
    while (select.firstChild) select.removeChild(select.firstChild);
    let fragment = document.createDocumentFragment();
    data.forEach((item) => {
      // console.trace(item);
      const opt = document.createElement('option');
      opt.value = item.id;
      opt.textContent = item.name;
      fragment.appendChild(opt);
      // <option value="1">Bank A</option>
    });
    select.appendChild(fragment);
  }

  function resetAccount(data) {
    // accountStore = data;
    updateAccountFrom(data);
    updateAccountTo(data);
  }


  function calculateAmount() {
    // set default exchange rate
    // output = input x exchange_rate
  }

  function setTodaysDate() {
    const today = Date.now() - (new Date()).getTimezoneOffset() * 60000;
    const dateInput = document.getElementById(UISelectors.date);
    dateInput.valueAsNumber = today;
  }

  function resetCategory() {
    const select = document.getElementById(UISelectors.categorySelect);
    while (select.firstChild) select.removeChild(select.firstChild);
    let fragment = document.createDocumentFragment();
    let count = 0;
    category.forEach((cat) => {
      const opt = document.createElement('option');
      opt.value = count;
      opt.textContent = cat.name;
      fragment.appendChild(opt);
      count++;
    });
    count = null;
    select.appendChild(fragment);
  }

  function initFormChangeListener() {
    document.getElementById(UISelectors.form).addEventListener('change', (e) => {
      if (e.target.id === UISelectors.accountFrom) {
        updateAccountTo(accountStore.filter((acc) => acc.id !== parseInt(e.target.value)));
      } else if (e.target.id === UISelectors.accountTo) {
        updateAccountFrom(accountStore.filter((acc) => acc.id !== parseInt(e.target.value)));
      }
    });
  }

  function initTransactionTypeListener() {
    document.getElementById(UISelectors.transactionType).addEventListener('change', (e) => {
      if (e.target.value === '0') {
        showAccountFrom();
        hideAccountTo();
        showCategory();
        showLabel();
        hideExchangeRate();
      }
      if (e.target.value === '1') {
        showAccountTo();
        hideAccountFrom();
        showCategory();
        showLabel();
        hideExchangeRate();
      }
      if (e.target.value === '2') {
        showAccountFrom();
        showAccountTo();
        hideLabel();
        hideCategory();
        showExchangeRate();
      }
    });
  }

  function resetExchangeRate() {
    document.getElementById(UISelectors.ex_rate).value = '1.0000';
  };

  function resetAmount() {
    document.getElementById(UISelectors.amountFrom).value = '';
    document.getElementById(UISelectors.amountTo).value = '';
  }

  function resetLabel() {
    document.getElementById(UISelectors.label).value = '';
  }

  function resetTransactionOption() {
    const transactionOption = document.getElementById(UISelectors.transactionType);
    while (transactionOption.firstChild) transactionOption.removeChild(transactionOption.firstChild);
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < transactionType.length; i++) {
      let option = document.createElement('option');
      if (i === 0) option.selected = true;
      option.value = i;
      option.innerText = transactionType[i].name;
      fragment.appendChild(option)
    }
    transactionOption.append(fragment);
    hideAccountTo();
  }

  return {

    initForm: function(data) {
      console.trace(data);
      // accountStore = data;
      resetTransactionOption();
      setTodaysDate();
      resetCategory();
      resetAccount(data);
      resetExchangeRate();
    }, 

    initEventListener: function() {
      document.getElementById(UISelectors.amountFrom).addEventListener('keyup', validateAndConvertToMoney);
      document.getElementById(UISelectors.amountTo).addEventListener('keyup', validateAndConvertToMoney);
      initTransactionTypeListener();
      initFormChangeListener();
    },

    showAmountFromError: function() {
      document.getElementById(UISelectors.amountFrom).setCustomValidity('invalid input');
      // document.getElementById(UISelectors.amountFrom).reportValidity();
    },

    showAmountToError: function () {
      document.getElementById(UISelectors.amountTo).setCustomValidity('invalid input');
      // document.getElementById(UISelectors.amountTo).reportValidity();
    },

    resetForm: function() {
      // document.getElementById(UISelectors.form).reset();
      resetAmount();
      resetLabel();
      resetExchangeRate();
      resetTransactionOption();
      resetCategory();
      setTodaysDate();
    }

  }
})();


