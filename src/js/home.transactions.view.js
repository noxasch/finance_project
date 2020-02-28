'use strict';

const { ipcRenderer } = require('electron');
const { transactionModel } = require('./transaction.model');
const { toLocaleFixed, convertDate, compareDate } = require('./timedate.helper');


const UIController = (function () {
  const maxRow = 10;
  const currencySymbol = 'RM';
  const parentName = '.table__body';
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
    deleteRow: function (id) {
      const rowId = `${idLabel[parentName]}-${id}`;
      // document.getElementById(rowId).remove();
      console.log(document.getElementById(rowId).children);
    },

    clearTable: function () {
      const table = document.querySelector(parentName);
      while (table.firstChild) table.removeChild(table.firstChild);
    },

    renderTransactions: function (data = null) {

      const table = document.querySelector(parentName);
      let rows = '';
      const { account, transactions } = data;
      // console.log(transactions);
      if (transactions) {
        // transactions.reverse();
        transactions.sort((a, b) => compareDate(a.datetime, b.datetime));
        transactions.forEach((item) => {
          let priceColor = 'text--green';
          if (item.operation === 0) {
            priceColor = 'text--red';
          }
          let date = convertDate(item.datetime);
          rows += `<tr class="row" data-id="${item.id}">
            <td class="table-cell">
              ${item.label}
              <span class="text--secondary">(${account[item.accountId].name})</span>
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
        console.log('no data to be render');
      }
    },

    updateTransaction: function (data) {
      const { account, item } = data;
      console.log(item);
      console.log(`${idLabel[parentName]}-${item.id}`);
      const row = document.getElementById(`${idLabel[parentName]}-${item.id}`);
      console.log(row);

      // console.log(row.childNodes);
      console.log(row.children);
      console.log(row.children[0].textContent);
      console.log(row.children[0].childNodes[0].textContent);
      console.log(row.children[0].children[0].innerText);
      row.children[0].childNodes[0].textContent = `${item.label} `;
      row.children[0].childNodes[1].textContent = `(${account[item.accountId].name})`;
      row.children[1].childNodes[0].textContent = `${convertDate(item.datetime)}`;
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
    transactionModel.setCurrentItem(itemId[itemId.length - 1]);
    e.target.nextElementSibling.classList.toggle('show');
  } else if (document.querySelector('.dropdown-menu.show') !== null) {
    document.querySelector('.dropdown-menu.show').classList.remove('show');
  }
}

const editItemHandler = function (e) {
  if (e.target.parentNode.classList.contains('dropdown-menu')) {
    if (e.target.classList.contains('edit')) {
      const itemId = transactionModel.getCurrentItem();
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
      const itemId = transactionModel.getCurrentItem();
      console.log('deleting', itemId);
      // UIController.deleteRow(itemId);
      // transactionModel.deleteCurrentItem();
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

ipcRenderer.send('webview:ready');

ipcRenderer.on('transaction:init', (e, data) => {
  console.log('transaction init');
  // console.log(data);
  UIController.clearTable();
  UIController.renderTransactions(data);
  UIController.updateTotalBalance(transactionModel.getTotalBalance(data.transactions));
});

ipcRenderer.on('transaction:new', (e, data) => {
  // console.log('transaction new');
  UIController.updateTotalBalance(transactionModel.getTotalBalance(data.transactions));
  UIController.renderTransactions({ account: data.account, transactions: data.newTransaction });
});

ipcRenderer.on('transaction:balance', (e, data) => {
  // console.log('transaction balance');
  UIController.updateTotalBalance(transactionModel.getTotalBalance(data.transactions));
});

ipcRenderer.on('data:update', (e, data) => {
  console.log(data);
})
