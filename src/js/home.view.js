const { ipcRenderer } = require('electron');
const { TransactionHelper } = require('./transaction.helper');
const { transactionType } = require('./model');
const { formValidated } = require('./form.validate.helper');

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
  document.getElementById('account-input-to').parentElement.classList.add('hide');
  document.getElementById('account-input-to').setAttribute('disabled', true);
}

function showAccountTo() {
  document.getElementById('account-input-to').parentElement.classList.remove('hide');
  document.getElementById('account-input-to').removeAttribute('disabled');
}

function hideAccountFrom() {
  document.getElementById('account-input-from').parentElement.classList.add('hide');
  document.getElementById('account-input-from').setAttribute('disabled', true);
}

function showAccountFrom() {
  document.getElementById('account-input-from').parentElement.classList.remove('hide');
  document.getElementById('account-input-from').removeAttribute('disabled');
}

function hideLabel() {
  document.getElementById('label-input').parentElement.classList.add('hide');
}

function showLabel() {
  document.getElementById('label-input').parentElement.classList.remove('hide');
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
    option.innerText = transactionType[i];
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
    const num = TransactionHelper.toLocaleFixed(parseFloat(e.target.value.replace(/\,/g, '')));
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
