'use strict';

const { ipcRenderer, remote } = require('electron');
const { toLocaleFixed } = require('./timedate.helper');
const { TransactionInput } = require('./transaction.input');
const { formValidated } = require('./form.validate.helper');

const UIdialogController = (function () {
  let transaction = null;
  const UISelectors = {
    form: 'transaction-form',
    transactionInput: 'transaction-input',
    accountFrom: 'account-input-from',
    accountTo: 'account-input-to',
    dateInput: 'date-input',
    amountInput: 'amount-input',
    labelInput: 'label-input',
    categoryInput: 'category-input',
    cancelBtn: 'cancel'
  }

  function setTransaction(itemData) {
    transaction = itemData;
  }


  return {
    setTransaction: setTransaction,
    getTransaction: function () {
      return transaction;
    },

    initData: function (itemData) {
      console.log(itemData);
      document.getElementById(UISelectors.transactionInput).value = itemData.type;
      if (itemData.type === 0) document.getElementById(UISelectors.accountFrom).value = itemData.accountId;
      if (itemData.type === 2) {
        document.getElementById(UISelectors.transactionInput).disabled = true;
        // console.log(remote.getCurrentWindow());
        // remote.getCurrentWindow().setSize(null, 568, true);
      };
      document.getElementById(UISelectors.amountInput).value = toLocaleFixed(parseFloat(itemData.amount.replace(/\,/g, '')));
      document.getElementById(UISelectors.labelInput).value = itemData.label;
      document.getElementById(UISelectors.categoryInput).value = itemData.category;
      document.getElementById(UISelectors.dateInput).value = itemData.datetime;
    },

    getSelectors: function () {
      return UISelectors;
    },

    addCancelButtonListener: function () {
      document.getElementById(UISelectors.cancelBtn).addEventListener('click', (e) => {
        remote.getCurrentWindow().close();
      })
    }
  }
})();

TransactionInput.setSelectors = UIdialogController.getSelectors();
TransactionInput.resetTransactionOption();
TransactionInput.addTransactionOptionListener();
TransactionInput.addAmountInputListener();
UIdialogController.addCancelButtonListener();

const transactionForm = document.getElementById(UIdialogController.getSelectors().form);
transactionForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(transactionForm);
  // console.log(formData);
  const result = {}
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:${value}`);
    if (key === 'amount') result[key] = value.replace(/\,/g, '');
    else result[key] = value;
  }

  if (formValidated(result)) {

    console.log(result);
    const updatedData = UIdialogController.getTransaction();
    console.log(updatedData);
    updatedData.type = parseInt(result['transaction-input']);
    updatedData.label = result['label'];
    updatedData.datetime = result['date'];
    updatedData.amount = result['amount'];
    updatedData.category = result['category-input'];
    // if (updatedData.type == 0) updatedData.accountId = result['account-input-from'];
    // if (updatedData.type == 1) updatedData.accountId = result['account-input-to'];
    // TODO: for transfer - type 2
    // console.log(updatedData);
    ipcRenderer.send('form:update', updatedData);
    remote.getCurrentWindow().close();
  }
});

ipcRenderer.send('dialog:ready');

ipcRenderer.on('data:init', (event, itemData) => {
  UIdialogController.setTransaction(itemData);
  UIdialogController.initData(itemData);
});
