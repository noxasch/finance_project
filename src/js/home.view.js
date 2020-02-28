'use strict';
const { ipcRenderer } = require('electron');
const { transactionType } = require('./constant');
const { formValidated } = require('./form.validate.helper');
const { toLocaleFixed } = require('./timedate.helper');
const { category } = require('./constant');

let accountStore = null;
const UIselectors = {
  accountFromSelect: 'account-input-from',
  accountToSelect: 'account-input-to',
  categorySelect: 'category-input',
  form: 'transaction-form'
}

window.addEventListener('hashchange', (e) => {
  if (document.querySelector(`${window.location.hash}`) !== null) {
    document.querySelector('section.show').classList.remove('show');
    document.querySelector(`${window.location.hash}`).classList.add('show');
  }

  document.querySelector('.menu-box__link.active').classList.remove('active');
  document.querySelector(`.menu-box__link[href="${window.location.hash}"]`).classList.add('active');
  // console.log(document.querySelector('.menu-box__link.active'));
  // console.log(document.querySelector(`.menu-box__ink[href="${window.location.hash}"]`));
});

// TODO: refactor for main page - refer update-dialog
const transactionForm = document.getElementById('transaction-form');
const transactionOption = document.getElementById('transaction-input');

function hideAccountTo() {
  document.getElementById('account-input-to').parentElement.parentElement.classList.add('hide');
  document.getElementById('account-input-to').setAttribute('disabled', true);
}

function showAccountTo() {
  document.getElementById('account-input-to').parentElement.parentElement.classList.remove('hide');
  document.getElementById('account-input-to').removeAttribute('disabled');
}

function hideAccountFrom() {
  document.getElementById('account-input-from').parentElement.parentElement.classList.add('hide');
  document.getElementById('account-input-from').setAttribute('disabled', true);
}

function showAccountFrom() {
  document.getElementById('account-input-from').parentElement.parentElement.classList.remove('hide');
  document.getElementById('account-input-from').removeAttribute('disabled');
}

function hideLabel() {
  document.getElementById('label-input').parentElement.parentElement.classList.add('hide');
}

function showLabel() {
  document.getElementById('label-input').parentElement.parentElement.classList.remove('hide');
}


function updateAccountFrom(data) {
  const select = document.getElementById(UIselectors.accountFromSelect);
  while (select.firstChild) select.removeChild(select.firstChild);
  let fragment = document.createDocumentFragment();
  data.forEach((item) => {
    const opt = document.createElement('option');
    opt.value = item.id;
    opt.textContent = item.account_name;
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
    opt.textContent = item.account_name;
    fragment.appendChild(opt);
    // <option value="1">Bank A</option>
  });
  select.appendChild(fragment);
}

function resetAccount(data) {
  accountStore = data;
  updateAccountFrom(data);
  updateAccountTo(data);
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

function formChangeListener() {
  document.getElementById(UIselectors.form).addEventListener('change', (e) =>{
    // console.log(e.target.id);
    // console.log(e.target.id === UIselectors.accountFromSelect);
    // console.log(typeof e.target.value);
    if (e.target.id === UIselectors.accountFromSelect) {
      updateAccountTo(accountStore.filter((acc) => acc.id !== parseInt(e.target.value)));
    } else if (e.target.id === UIselectors.accountToSelect) {
      updateAccountFrom(accountStore.filter((acc) => acc.id !== parseInt(e.target.value)));
    }
  });
}

(function setTodaysDate() {
  // set to today's date
  // let today = new Date().toLocaleDateString();
  let today = Date.now() - (new Date()).getTimezoneOffset() * 60000;
  // console.log(today);
  let dateInput = document.getElementById("date-input");
  dateInput.valueAsNumber = today;
})();


(function resetTransactionOption() {
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
})();

transactionOption.addEventListener('change', (e) => {
  if (e.target.value === '0') {
    showAccountFrom();
    hideAccountTo();
    showLabel();
  }
  if (e.target.value === '1') {
    showAccountTo();
    hideAccountFrom();
    showLabel();
  }
  if (e.target.value === '2') {
    showAccountFrom();
    showAccountTo();
    hideLabel();
  }
});

function displayAmountError() {
  document.getElementById('amount-input').setCustomValidity('invalid input');
  document.getElementById('amount-input').reportValidity();
}

initCategory();
// formChangeListener(); // opt to check during validation instead

transactionForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(transactionForm);
  // console.log(formData);
  const results = {}
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:${value}`);
    if (key === 'amount') results[key] = value.replace(/\,/g, '');
    else results[key] = value;
  }

  if (formValidated(results)) {
    ipcRenderer.send('form:submit', results);
    document.getElementById('right-toggle').checked = false;
    document.querySelector('.grid-container__right').classList.remove('show');;
  } else {
    displayAmountError();
  }
});

document.getElementById('amount-input').addEventListener('keyup', (e) => {
  if (/[\d\.]+/i.test(e.target.value)) {
    // console.log('\ninput', e.target.value);
    // let value = e.target.value.replace(/\,/g, '');
    // console.log('Clean', value);
    // value = parseFloat(value);
    // console.log('Floated', value);
    // const num = toLocaleFixed(value);
    const num = toLocaleFixed(parseFloat(e.target.value.replace(/\,/g, '')));
    // console.log('Locale', num);
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

ipcRenderer.on('transaction:init', (_, data) => {
  console.log('muahahgag');
  console.log(data);
  resetAccount(data.account);
});
//UIController.updateAccount(data.account);