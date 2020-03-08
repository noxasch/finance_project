// 'use strict';
// // refactor to quickmenu.js
const { ipcRenderer } = require('electron');
const { TransactionInputUI } = require('./transaction.input');
// const { transactionType } = require('./constant');
// const { formValidated } = require('./form.validate.helper');
// const { toLocaleFixed } = require('./timedate.helper');
// const { category } = require('./constant');

// let accountStore = null;
// const UIselectors = {
//   transactionType: 'transaction-type',
//   accountFrom: 'account-from',
//   amountFrom: 'amount-from',
//   accountTo: 'account-to',
//   amountTo: 'amount-to',
//   label: 'label-input',
//   date: 'date-input',
//   categorySelect: 'category-input',
//   form: 'transaction-form'
// }

// // TODO: refactor for main page - refer update-dialog
// const transactionForm = document.getElementById('transaction-form');
// const transactionOption = document.getElementById('transaction-input');

// function hideAccountTo() {
//   document.getElementById(UIselectors.accountTo).parentElement.parentElement.classList.add('hide');
//   document.getElementById(UIselectors.amountTo).parentElement.classList.add('hide');
//   document.getElementById(UIselectors.accountTo).setAttribute('disabled', true);
// }

// function showAccountTo() {
//   document.getElementById(UIselectors.accountTo).parentElement.parentElement.classList.remove('hide');
//   document.getElementById(UIselectors.amountTo).parentElement.classList.remove('hide');
//   document.getElementById(UIselectors.accountTo).removeAttribute('disabled');
// }

// function hideAccountFrom() {
//   document.getElementById(UIselectors.accountFrom).parentElement.parentElement.classList.add('hide');
//   document.getElementById(UIselectors.amountFrom).parentElement.classList.add('hide');
//   document.getElementById(UIselectors.accountFrom).setAttribute('disabled', true);
// }

// function showAccountFrom() {
//   document.getElementById(UIselectors.accountFrom).parentElement.parentElement.classList.remove('hide');
//   document.getElementById(UIselectors.amountFrom).parentElement.classList.remove('hide');
//   document.getElementById(UIselectors.accountFrom).removeAttribute('disabled');
// }

// function hideLabel() {
//   document.getElementById(UIselectors.label).parentElement.parentElement.classList.add('hide');
// }

// function showLabel() {
//   document.getElementById(UIselectors.label).parentElement.parentElement.classList.remove('hide');
// }


// function updateAccountFrom(data) {
//   const select = document.getElementById(UIselectors.accountFrom);
//   while (select.firstChild) select.removeChild(select.firstChild);
//   let fragment = document.createDocumentFragment();
//   data.forEach((item) => {
//     console.log(item);
//     const opt = document.createElement('option');
//     opt.value = item.id;
//     opt.textContent = item.name;
//     fragment.appendChild(opt);
//     // <option value="1">Bank A</option>
//   });
//   select.appendChild(fragment);
// }

// function updateAccountTo(data) {
//   const select = document.getElementById(UIselectors.accountTo)
//   while (select.firstChild) select.removeChild(select.firstChild);
//   let fragment = document.createDocumentFragment();
//   data.forEach((item) => {
//     console.log(item);
//     const opt = document.createElement('option');
//     opt.value = item.id;
//     opt.textContent = item.name;
//     fragment.appendChild(opt);
//     // <option value="1">Bank A</option>
//   });
//   select.appendChild(fragment);
// }

// function resetAccount(data) {
//   accountStore = data;
//   updateAccountFrom(accountStore);
//   updateAccountTo(accountStore);
// }

// function calculateAmount() {
//   // set default exchange rate
//   // output = input x exchange_rate
// }

// function initCategory() {
//   const select = document.getElementById(UIselectors.categorySelect);
//   while (select.firstChild) select.removeChild(select.firstChild);
//   let fragment = document.createDocumentFragment();
//   let count = 0;
//   category.forEach((cat) => {
//     const opt = document.createElement('option');
//     opt.value = count;
//     opt.textContent = cat.name;
//     fragment.appendChild(opt);
//     count++;
//   });
//   count = null;
//   select.appendChild(fragment);
// }

// function formChangeListener() {
//   document.getElementById(UIselectors.form).addEventListener('change', (e) =>{
//     // console.log(e.target.id);
//     // console.log(e.target.id === UIselectors.accountFrom);
//     // console.log(typeof e.target.value);
//     if (e.target.id === UIselectors.accountFrom) {
//       updateAccountTo(accountStore.filter((acc) => acc.id !== parseInt(e.target.value)));
//     } else if (e.target.id === UIselectors.accountTo) {
//       updateAccountFrom(accountStore.filter((acc) => acc.id !== parseInt(e.target.value)));
//     }
//   });
// }

// function setTodaysDate() {
//   // set to today's date
//   // let today = new Date().toLocaleDateString();
//   let today = Date.now() - (new Date()).getTimezoneOffset() * 60000;
//   // console.log(today);
//   let dateInput = document.getElementById("date-input");
//   dateInput.valueAsNumber = today;
// }


// (function resetTransactionOption() {
//   while (transactionOption.firstChild) transactionOption.removeChild(transactionOption.firstChild);
//   const fragment = document.createDocumentFragment();
//   for (let i = 0; i < transactionType.length; i++) {
//     let option = document.createElement('option');
//     if (i === 0) option.selected = true;
//     option.value = i;
//     option.innerText = transactionType[i].name;
//     fragment.appendChild(option)
//   }
//   transactionOption.append(fragment);
//   hideAccountTo();
// })();

// transactionOption.addEventListener('change', (e) => {
//   if (e.target.value === '0') {
//     showAccountFrom();
//     hideAccountTo();
//     showLabel();
//   }
//   if (e.target.value === '1') {
//     showAccountTo();
//     hideAccountFrom();
//     showLabel();
//   }
//   if (e.target.value === '2') {
//     showAccountFrom();
//     showAccountTo();
//     hideLabel();
//   }
// });

// function displayAmountError() {
//   document.getElementById('amount-input').setCustomValidity('invalid input');
//   document.getElementById('amount-input').reportValidity();
// }

// initCategory();
// setTodaysDate();
// // formChangeListener(); // opt to check during validation instead

// transactionForm.addEventListener('submit', (e) => {
//   e.preventDefault();
//   const formData = new FormData(transactionForm);
//   // console.log(formData);
//   const results = {}
//   for (let [key, value] of formData.entries()) {
//     // console.log(`${key}:${value}`);
//     if (key === 'amount') results[key] = value.replace(/\,/g, '');
//     else results[key] = value;
//   }
//   console.log(results);
//   if (formValidated(results)) {
//     ipcRenderer.send('form:submit', results);
//     e.target.reset();
//     setTodaysDate();
//     document.getElementById('right-toggle').checked = false;
//     document.querySelector('.grid-container__right').classList.remove('show');;
//   } else {
//     displayAmountError();
//   }
// });

// function validateAndConvertToMoney(e) {
//   if (/[\d\.]+/i.test(e.target.value)) {
//     // console.log('\ninput', e.target.value);
//     // let value = e.target.value.replace(/\,/g, '');
//     // console.log('Clean', value);
//     // value = parseFloat(value);
//     // console.log('Floated', value);
//     // const num = toLocaleFixed(value);
//     const num = toLocaleFixed(parseFloat(e.target.value.replace(/\,/g, '')));
//     // console.log('Locale', num);
//     const start = e.target.selectionStart;
//     const end = e.target.selectionEnd;
//     e.target.value = num;
//     e.target.setSelectionRange(start, end);
//     e.target.setCustomValidity('');
//   }
//   else if (/[A-Za-z]/i.test(e.target.value)) {
//     e.target.setCustomValidity('Amount can only be numbers');
//   }
// }

// document.getElementById(UIselectors.amountFrom).addEventListener('keyup',validateAndConvertToMoney);
// document.getElementById(UIselectors.amountTo).addEventListener('keyup', validateAndConvertToMoney);


// ipcRenderer.on('transaction:init', (_, data) => {
//   console.log('muahahgag');
//   console.log(data);
//   resetAccount(data.account);
// });

// ipcRenderer.on('data:update', (e, data) => {
//   console.log(data); 
//   accountStore.push(data);
//   updateAccountFrom(accountStore);
//   updateAccountTo(accountStore);
// });
// //UIController.updateAccount(data.account);

TransactionInputUI.initEventListener();
ipcRenderer.on('init:account', (_, data) => {
  TransactionInputUI.initForm(data);
});