'use strict';
// // refactor to quickmenu.js
const { ipcRenderer } = require('electron');
const { TransactionInputUI } = require('./transaction.input');
const { formValidated } = require('./form.validate.helper');
// const { TransactionHelper } = require('./transaction.helper');

const UISelectors = {
  form: 'transaction-form',
  toggleBtn: 'right-toggle',
  sideForm: '.grid-container__right'
}

function initSubmitEvent() {
  const transactionForm = document.getElementById(UISelectors.form);
  transactionForm.addEventListener('submit', (e) => {
    console.log(e);
    e.preventDefault();
    const formData = new FormData(transactionForm);
    // console.log(formData);
    const results = {}
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:${value}`);
      if (key === 'amount') results[key] = value.replace(/\,/g, '');
      else results[key] = value;
    }
    console.log(results);
    if (formValidated(results)) {
      ipcRenderer.send('account:add', results);
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
  TransactionInputUI.initForm(data);
});

initMain();