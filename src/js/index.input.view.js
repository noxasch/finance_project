'use strict';
// // refactor to quickmenu.js
const { ipcRenderer } = require('electron');
const { TransactionInputUI } = require('./transaction.input');
const { validateAmount } = require('./form.validate.helper');
// const { TransactionHelper } = require('./transaction.helper');

const UISelectors = {
  form: 'transaction-form',
  toggleBtn: 'right-toggle',
  sideForm: '.grid-container__right'
}

function initSubmitEvent() {
  const transactionForm = document.getElementById(UISelectors.form);
  transactionForm.addEventListener('submit', (e) => {
    console.trace(e);
    e.preventDefault();
    const formData = new FormData(transactionForm);
    // console.trace(formData);
    const results = {}
    for (let [key, value] of formData.entries()) {
      console.trace(`${key}:${value}`);
      if (key === 'amount') results[key] = value.replace(/\,/g, '');
      else results[key] = value;
    }
    console.trace(results);
    if (validateAmount(results)) {
      ipcRenderer.send('transaction:add', results);
      TransactionInputUI.resetForm();
      document.getElementById(UISelectors.toggleBtn).checked = false;
      document.querySelector(UISelectors.sideForm).classList.remove('show');;
    } else {
      TransactionInputUI.showAmountFromError();
    }
  });
}

function initMain() {
  TransactionInputUI.initEventListener();
  TransactionInputUI.initEventListener();
  initSubmitEvent();
}

ipcRenderer.on('account:init', (_, data) => {
  console.trace("YO");
  console.trace('ACCOUNT:INIT', data);
  TransactionInputUI.initForm(data);
});

initMain();