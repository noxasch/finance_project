'use strict';
const { ipcRenderer } = require('electron');
const Transaction = require('./transaction');
const { CountryISO } = require('./country.iso');
const { toLocaleFixed, convertDate, compareDate, fromUnixTimeStamp } = require('./timedate.helper');

const UIController = (function () {
  const maxRow = 10;
  let baseCurrency = null;
  let currencySymbol = null;
  const tableSelector = '#home .table__body';
  const idLabel = {
    '.table__body': 'home-row'
  }

  const animateValue = function (selector, end, duration = 500) {
    // console.log(end);
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
      // console.log(info);
      baseCurrency = info.currency;
      currencySymbol = info.symbol;
      // currencySymbol = info;
    },

    deleteRow: function (id) {
      const rowId = `${idLabel[tableSelector]}-${id}`;
      // document.getElementById(rowId).remove();
      console.log(document.getElementById(rowId).children);
    },

    clearTable: function () {
      // console.log(tableSelector);
      const table = document.querySelector(tableSelector);
      // console.log(table);
      while (table.firstChild) table.removeChild(table.firstChild);
    },

    renderTransactions: function (data) {

      const table = document.querySelector(tableSelector);
      let rows = '';
      const { account, transactions } = data;
      // console.log(transactions);
      if (transactions) {
        // transactions.reverse();
        transactions.sort((a, b) => compareDate(fromUnixTimeStamp(a.transaction_date), fromUnixTimeStamp(b.transaction_date)));
        transactions.forEach((item) => {
          let priceColor = 'text--green';
          if (item.operation === 0) {
            priceColor = 'text--red';
          }
          let currentAccount = account.filter((acc) => acc.id === item.account_id);
          // console.log(account);
          // console.log(item.transaction_date);
          // console.log(item);
          // console.log(currentAccount);
          // console.log(currentAccount[0]);
          // console.log(currencySymbol);
          // console.log(item);
          let date = fromUnixTimeStamp(item.transaction_date);
          rows += `<tr class="row" data-id="${item.id}">
            <td class="table-cell">
              ${item.label}
              <span class="text--secondary">(${currentAccount[0].name})</span>
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
          </tr>`.replace(/\s+/g, ' ');
        });
        table.insertAdjacentHTML('afterbegin', rows);
        while (parseInt(table.childElementCount) > maxRow) table.removeChild(table.lastChild);
      } else {
        console.log('no data to render');
      }
    },

    updateTransaction: function (data) {
      const { account, item } = data;
      // console.log(item);
      // console.log(`${idLabel[parentName]}-${item.id}`);
      const row = document.getElementById(`${idLabel[parentName]}-${item.id}`);
      // console.log(row);
      let currentAccount = account.filter((acc) => acc.id === item.account_id);
      // console.log(currentAccount);
      // console.log(row.childNodes);
      // console.log(row.children);
      // console.log(row.children[0].textContent);
      // console.log(row.children[0].childNodes[0].textContent);
      // console.log(row.children[0].children[0].innerText);
      row.children[0].childNodes[0].textContent = `${item.label} `;
      row.children[0].childNodes[1].textContent = `(${currentAccount.account_name})`;
      row.children[1].childNodes[0].textContent = `${convertDate(item.transaction_date)}`;
    },

    updateTotalBalance: function (data) {
      let balance = 0;
      data.account.forEach((item) => {
        if (item.currency === baseCurrency) balance += (item.balance + item.initial_balance);
        else console.log(item.currency); // calculate and then convert based on latest FX rate
      });
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
      console.log('edit', itemId);
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
      console.log('deleting', itemId);
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

ipcRenderer.send('home:view:ready');

ipcRenderer.on('home:init', (_, data) => {
  // first load and edit
  UIController.clearTable();
  UIController.setCurrencyInfo(data.baseCurrency);
  UIController.updateTotalBalance(data);
  UIController.renderTransactions(data);
});

ipcRenderer.on('home:transaction:update', (_, data) => {
  // first load and edit
  UIController.clearTable();
  UIController.updateTotalBalance(data);
  UIController.renderTransactions(data);
});

// ipcRenderer.on('home:balance', (_, data) => {
//   // update balance after deletion
// });

// ipcRenderer.on('home:transaction', (_, data) => {
//   // new transaction
// });

// ipcRenderer.on('home:chart', (_, data) => {

// });

// ipcRenderer.on('transaction:init', (e, data) => {
//   console.log('transaction init');
//   // console.log(data);
//   UIController.clearTable();
//   UIController.renderTransactions(data);
//   console.log(data.transactions);
//   UIController.updateTotalBalance(Transaction.getTotalBalance(data.transactions));
// });

// ipcRenderer.on('home:new:transaction', (e, data) => {
//   // console.log('transaction new');
//   UIController.updateTotalBalance(Transaction.getTotalBalance(data.transactions));
//   UIController.renderTransactions({ account: data.account, transactions: data.newTransaction });
// });

// ipcRenderer.on('transaction:balance', (e, data) => {
//   // console.log('transaction balance');
//   UIController.updateTotalBalance(Transaction.getTotalBalance(data.transactions));
// });
