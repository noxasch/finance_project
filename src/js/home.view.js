'use strict';
const { ipcRenderer } = require('electron');
const Transaction = require('./transaction');
const { CountryISO } = require('./country.iso');
const { toLocaleFixed, convertDate, compareDate, fromUnixTimeStamp } = require('./timedate.helper');

const HomeUI = (function () {
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

  const dropdownHandler = function (e) {
    // console.log(e);
    if (e.target.parentNode.classList.contains('dropdown')) {
      if (document.querySelector('.dropdown-menu.show') !== null && document.querySelector('.dropdown-menu.show') !== e.target.nextElementSibling)
        document.querySelector('.dropdown-menu.show').classList.remove('show');
      let itemId = e.target.parentNode.parentNode.parentNode.dataset.id;
      let transferId = e.target.parentNode.parentNode.parentNode.dataset.transfer_id;
      // // itemId = itemId.split('-');
      // console.log(itemId);
      // // Transaction.setCurrentItem(itemId[itemId.length - 1]);
      Transaction.setCurrentItem({ id: itemId, transfer_id: transferId});
      e.target.nextElementSibling.classList.toggle('show');
    } else if (document.querySelector('.dropdown-menu.show') !== null) {
      document.querySelector('.dropdown-menu.show').classList.remove('show');
    }
  }

  const editItemHandler = function (e) {
    if (e.target.parentNode.classList.contains('dropdown-menu')) {
      if (e.target.classList.contains('edit')) {
        const item = Transaction.getCurrentItem();
        console.log('edit', item);
        ipcRenderer.send('transaction:window:open', item);
      }
    }
  }

  const deleteItemHandler = function (e) {
    if (e.target.parentNode.classList.contains('dropdown-menu')) {
      if (e.target.classList.contains('delete')) {
        // handle deletion
        // remove from display
        const item = Transaction.getCurrentItem();
        console.log('deleting', item);
        // remove from db - delete when db confirm deletion
        ipcRenderer.send('transaction:delete', item);
      }
    }
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
          console.log(item);
          let date = fromUnixTimeStamp(item.transaction_date);
          rows += `<tr class="row" data-id="${item.id}" data-transfer_id="${item.transfer_id}">
            <td class="table-cell">
              ${item.label}
              <span class="text--secondary">(${currentAccount[0].name})</span>
            </td>
            <td class="table-cell">${date}</td>
            <td class="table-cell ${priceColor}"> ${currencySymbol} ${toLocaleFixed(parseFloat(item.amount))}
              &nbsp;&nbsp;
              <span class="dropdown">
                <i class="fas fa-ellipsis-h"></i>
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
    },

    rowEventListener: function() {
      document.querySelector(tableSelector).addEventListener('click', (e) => {
        // console.log(e);
        dropdownHandler(e);
        editItemHandler(e);
        deleteItemHandler(e);
      })
    }
  }
})();

// on submit - reset account choice

// const dropdownHandler = function (e) {
//   if (e.target.parentNode.classList.contains('dropdown')) {
//     if (document.querySelector('.dropdown-menu.show') !== null && document.querySelector('.dropdown-menu.show') !== e.target.nextElementSibling)
//       document.querySelector('.dropdown-menu.show').classList.remove('show');
//     let itemId = e.target.parentNode.parentNode.parentNode.dataset.id;
//     // itemId = itemId.split('-');
//     Transaction.setCurrentItem(itemId[itemId.length - 1]);
//     e.target.nextElementSibling.classList.toggle('show');
//   } else if (document.querySelector('.dropdown-menu.show') !== null) {
//     document.querySelector('.dropdown-menu.show').classList.remove('show');
//   }
// }

// const editItemHandler = function (e) {
//   if (e.target.parentNode.classList.contains('dropdown-menu')) {
//     if (e.target.classList.contains('edit')) {
//       const itemId = Transaction.getCurrentItem();
//       console.log('edit', itemId);
//       ipcRenderer.send('update:item', itemId);
//     }
//   }
// }

// const deleteItemHandler = function (e) {
//   if (e.target.parentNode.classList.contains('dropdown-menu')) {
//     if (e.target.classList.contains('delete')) {
//       // handle deletion
//       // remove from display
//       const itemId = Transaction.getCurrentItem();
//       console.log('deleting', itemId);
//       // HomeUI.deleteRow(itemId);
//       // Transaction.deleteCurrentItem();
//       // remove from db - delete when db confirm deletion
//       ipcRenderer.send('transaction:delete', itemId);
//     }
//   }
// }

// document.addEventListener('click', (e) => {
//   dropdownHandler(e);
//   editItemHandler(e);
//   deleteItemHandler(e);
// });
HomeUI.rowEventListener();

ipcRenderer.send('home:view:ready');

ipcRenderer.on('home:init', (_, data) => {
  // first load and edit
  HomeUI.clearTable();
  HomeUI.setCurrencyInfo(data.baseCurrency);
  HomeUI.updateTotalBalance(data);
  HomeUI.renderTransactions(data);
});

ipcRenderer.on('account:init', (_, account) => {
  // if add new account
  let data = { account };
  HomeUI.updateTotalBalance(data);
});

ipcRenderer.on('home:transaction:update', (_, data) => {
  // first load and edit
  HomeUI.clearTable();
  HomeUI.updateTotalBalance(data);
  HomeUI.renderTransactions(data);
});

window.addEventListener('message', (e) => {
  if (e.data === 'home:view:clear') HomeUI.clearTable();
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
//   HomeUI.clearTable();
//   HomeUI.renderTransactions(data);
//   console.log(data.transactions);
//   HomeUI.updateTotalBalance(Transaction.getTotalBalance(data.transactions));
// });

// ipcRenderer.on('home:new:transaction', (e, data) => {
//   // console.log('transaction new');
//   HomeUI.updateTotalBalance(Transaction.getTotalBalance(data.transactions));
//   HomeUI.renderTransactions({ account: data.account, transactions: data.newTransaction });
// });

// ipcRenderer.on('transaction:balance', (e, data) => {
//   // console.log('transaction balance');
//   HomeUI.updateTotalBalance(Transaction.getTotalBalance(data.transactions));
// });
