'use strict';
const { ipcRenderer } = require('electron');
const Transaction = require('./transaction');
const { CountryISO } = require('./country.iso');
const { toLocaleFixed, convertDate, compareDate } = require('./timedate.helper');

const UIController = (function () {
  const maxRow = 10;
  let baseCurrency = null;
  let currencySymbol = null;
  const tableSelector = '.table__body';
  const idLabel = {
    '.table__body': 'home-row'
  }

  const animateValue = function (selector, end, duration = 500) {
    // console.trace(end);
    const el = document.querySelector(selector);
    const start = parseFloat(el.textContent.replace(',', ''));
    const range = end - start;
    const minTimer = 50;
    let stepTime = Math.abs(Math.floor(duration / range));
    stepTime = Math.max(stepTime, minTimer);
    const startTime = new Date().getTime();
    const endTime = startTime + duration;
    let timer;

    function run() {
      const now = new Date().getTime();
      let remaining = Math.max((endTime - now) / duration, 0);
      // const value = Math.round(end - (remaining * range));
      const value = end - (remaining * range);
      el.textContent = toLocaleFixed(value);
      if (value == end) {
        clearInterval(timer);
      }
    }

    timer = setInterval(run, stepTime);
    run();
  }

  return {

    setCurrencyInfo: function(base) {
      let info = CountryISO.getCountryInfoByCurrency(base)
      // console.trace(info);
      baseCurrency = info.currency;
      currencySymbol = info.symbol;
      // currencySymbol = info;
    },

    deleteRow: function (id) {
      const rowId = `${idLabel[tableSelector]}-${id}`;
      // document.getElementById(rowId).remove();
      console.trace(document.getElementById(rowId).children);
    },

    clearTable: function () {
      const table = document.querySelector(tableSelector);
      while (table.firstChild) table.removeChild(table.firstChild);
    },

    renderTransactions: function (data) {

      const table = document.querySelector(tableSelector);
      let rows = '';
      const { account, transactions } = data;
      // console.trace(transactions);
      if (transactions) {
        // transactions.reverse();
        transactions.sort((a, b) => compareDate(a.transaction_date, b.transaction_date));
        transactions.forEach((item) => {
          let priceColor = 'text--green';
          if (item.operation === 0) {
            priceColor = 'text--red';
          }
          let currentAccount = account.filter((acc) => acc.id === item.account_id);
          // console.trace(account);
          // console.trace(item.transaction_date);
          // console.trace(item);
          // console.trace(currentAccount);
          // console.trace(currentAccount[0]);
          console.trace(currencySymbol);
          let date = convertDate(item.transaction_date);
          rows += `<tr class="row" data-id="${item.id}">
            <td class="table-cell">
              ${item.label}
              <span class="text--secondary">(${currentAccount[0].account_name})</span>
            </td>
            <td class="table-cell">${date}</td>
            <td class="table-cell ${priceColor}"> ${currencySymbol} ${toLocaleFixed(parseFloat(item.amount))}
              &nbsp;&nbsp;
              <span class="dropdown">
                <i class="fas fa-ellipsis-v"></i>
                <div class="dropdown-menu dropdown-menu-right">
                  <span class="dropdown__item edit">Edit</span>
                  <span class="dropdown__item delete">Delete</span>
                </div>
              </span>
            </td>
          </tr>`;
        });
        table.insertAdjacentHTML('afterbegin', rows);
        while (parseInt(table.childElementCount) > maxRow) table.removeChild(table.lastChild);
      } else {
        console.trace('no data to render');
      }
    },

    updateTransaction: function (data) {
      const { account, item } = data;
      // console.trace(item);
      // console.trace(`${idLabel[parentName]}-${item.id}`);
      const row = document.getElementById(`${idLabel[parentName]}-${item.id}`);
      // console.trace(row);
      let currentAccount = account.filter((acc) => acc.id === item.account_id);
      // console.trace(row.childNodes);
      // console.trace(row.children);
      // console.trace(row.children[0].textContent);
      // console.trace(row.children[0].childNodes[0].textContent);
      // console.trace(row.children[0].children[0].innerText);
      row.children[0].childNodes[0].textContent = `${item.label} `;
      row.children[0].childNodes[1].textContent = `(${currentAccount.account_name})`;
      row.children[1].childNodes[0].textContent = `${convertDate(item.transaction_date)}`;
    },

    updateTotalBalance: function (balance) {
      animateValue('.card__amount', balance);
      if (parseFloat(balance) < 0) {
        document.querySelector('.card__amount').classList.add('text--red');
        document.querySelector('.card__currency').classList.add('text--red');
      }
      else {
        document.querySelector('.card__amount').classList.remove('text--red');
        document.querySelector('.card__currency').classList.remove('text--red');
      }
    }
  }
})();

// on submit - reset account choice

const dropdownHandler = function (e) {
  if (e.target.parentNode.classList.contains('dropdown')) {
    if (document.querySelector('.dropdown-menu.show') !== null && document.querySelector('.dropdown-menu.show') !== e.target.nextElementSibling)
      document.querySelector('.dropdown-menu.show').classList.remove('show');
    let itemId = e.target.parentNode.parentNode.parentNode.dataset.id;
    // itemId = itemId.split('-');
    Transaction.setCurrentItem(itemId[itemId.length - 1]);
    e.target.nextElementSibling.classList.toggle('show');
  } else if (document.querySelector('.dropdown-menu.show') !== null) {
    document.querySelector('.dropdown-menu.show').classList.remove('show');
  }
}

const editItemHandler = function (e) {
  if (e.target.parentNode.classList.contains('dropdown-menu')) {
    if (e.target.classList.contains('edit')) {
      const itemId = Transaction.getCurrentItem();
      console.trace('edit', itemId);
      ipcRenderer.send('update:item', itemId);
    }
  }
}

const deleteItemHandler = function (e) {
  if (e.target.parentNode.classList.contains('dropdown-menu')) {
    if (e.target.classList.contains('delete')) {
      // handle deletion
      // remove from display
      const itemId = Transaction.getCurrentItem();
      console.trace('deleting', itemId);
      // UIController.deleteRow(itemId);
      // Transaction.deleteCurrentItem();
      // remove from db - delete when db confirm deletion
      ipcRenderer.send('delete:item', itemId);
    }
  }
}

document.addEventListener('click', (e) => {
  dropdownHandler(e);
  editItemHandler(e);
  deleteItemHandler(e);
});

ipcRenderer.send('home:ready');

ipcRenderer.on('home:init', (_, data) => {
  // first load and edit
  UIController.clearTable();
  UIController.setCurrencyInfo(data.baseCurrency);
  UIController.updateTotalBalance(data.balance);
  UIController.renderTransactions(data);
});

ipcRenderer.on('home:balance', (_, data) => {
  // update balance after deletion
});

ipcRenderer.on('home:transaction', (_, data) => {
  // new transaction
});

ipcRenderer.on('home:chart', (_, data) => {

});

// ipcRenderer.on('transaction:init', (e, data) => {
//   console.trace('transaction init');
//   // console.trace(data);
//   UIController.clearTable();
//   UIController.renderTransactions(data);
//   console.trace(data.transactions);
//   UIController.updateTotalBalance(Transaction.getTotalBalance(data.transactions));
// });

// ipcRenderer.on('home:new:transaction', (e, data) => {
//   // console.trace('transaction new');
//   UIController.updateTotalBalance(Transaction.getTotalBalance(data.transactions));
//   UIController.renderTransactions({ account: data.account, transactions: data.newTransaction });
// });

// ipcRenderer.on('transaction:balance', (e, data) => {
//   // console.trace('transaction balance');
//   UIController.updateTotalBalance(Transaction.getTotalBalance(data.transactions));
// });
