'use strict';

const { ipcRenderer, remote } = require('electron');
const { toLocaleFixed } = require('./timedate.helper');
const { TransactionInput } = require('./transaction.input.helper');
const { validateAmount } = require('./form.validate.helper');
const { category } = require('./constant');

const UIdialogController = (function () {
  let transaction = null;
  let accountStore = null;
  const UIselectors = {
    form: 'transaction-form',
    transactionInput: 'transaction-input',
    accountFromSelect: 'account-input-from',
    accountToSelect: 'account-input-to',
    dateInput: 'date-input',
    amountInput: 'amount-input',
    labelInput: 'label-input',
    categorySelect: 'category-input',
    cancelBtn: 'cancel'
  }

  function setInitialData(data) {
    transaction = data.transaction;
    accountStore = data.account;
    resetAccount();
    initCategory();
  }

  function updateAccountFrom(data) {
    const select = document.getElementById(UIselectors.accountFromSelect);
    while (select.firstChild) select.removeChild(select.firstChild);
    let fragment = document.createDocumentFragment();
    data.forEach((item) => {
      const opt = document.createElement('option');
      opt.value = item.id;
      opt.textContent = item.name;
      fragment.appendChild(opt);
      // <option value="1">Bank A</option>
    });
    select.appendChild(fragment);
  }

  function updateAccountTo(data) {
    const select = document.getElementById(UIselectors.accountToSelect)
    while (select.firstChild) select.removeChild(select.firstChild);
    let fragment = document.createDocumentFragment();
    data.forEach((item) => {
      const opt = document.createElement('option');
      opt.value = item.id;
      opt.textContent = item.name;
      fragment.appendChild(opt);
      // <option value="1">Bank A</option>
    });
    select.appendChild(fragment);
  }

  function initCategory() {
    const select = document.getElementById(UIselectors.categorySelect);
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

  function resetAccount() {
    updateAccountFrom(accountStore);
    updateAccountTo(accountStore);
  }


  return {
    setInitialData: setInitialData,
    getTransaction: function () {
      return transaction;
    },

    initData: function (itemData) {
      console.log(itemData);
      document.getElementById(UIselectors.transactionInput).value = itemData.transaction_type;
      if (itemData.transaction_type === 0) {
        document.getElementById(UIselectors.accountFromSelect).value = itemData.account_id;
        document.getElementById(UIselectors.accountToSelect).value = '';
      }
      if (itemData.transaction_type === 1) {
        document.getElementById(UIselectors.accountToSelect).value = itemData.account_id;
        document.getElementById(UIselectors.accountToSelect).value = '';
      }
      if (itemData.transaction_type === 2) {
        document.getElementById(UIselectors.transactionInput).disabled = true;
        // console.log(remote.getCurrentWindow());
        // remote.getCurrentWindow().setSize(null, 568, true);
      };
      document.getElementById(UIselectors.amountInput).value = toLocaleFixed(parseFloat(`${itemData.amount}`.replace(/\,/g, '')));
      document.getElementById(UIselectors.labelInput).value = itemData.label;
      document.getElementById(UIselectors.categorySelect).value = itemData.category;
      document.getElementById(UIselectors.dateInput).value = itemData.transaction_date;
    },

    getSelectors: function () {
      return UIselectors;
    },

    addCancelButtonListener: function () {
      document.getElementById(UIselectors.cancelBtn).addEventListener('click', (e) => {
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

  if (validateAmount(result)) {

    console.log(result);
    const updatedData = UIdialogController.getTransaction();
    console.log(updatedData);
    updatedData.transaction_type = parseInt(result['transaction-input']);
    updatedData.label = result['label'];
    updatedData.transaction_date = result['date'];
    updatedData.amount = result['amount'];
    updatedData.category = result['category-input'];
    // if (updatedData.transaction_date == 0) updatedData.accountId = result['account-input-from'];
    // if (updatedData.transaction_date == 1) updatedData.accountId = result['account-input-to'];
    // TODO: for transfer - type 2
    // console.log(updatedData);
    ipcRenderer.send('form:update', updatedData);
    remote.getCurrentWindow().close();
  }
});

ipcRenderer.send('dialog:ready');

ipcRenderer.on('data:init', (event, data) => {
  UIdialogController.setInitialData(data);
  UIdialogController.initData(data.transaction);
});
