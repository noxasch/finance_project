'use strict';
const { ipcRenderer } = require('electron');
const { icons } = require('./constant');
const { toLocaleFixed } = require('./timedate.helper');
 
const AccountUI = (function() {
  const UISelector = {
    table: '#account .table__body'
  }

  function renderAccountList(account) {
    console.log(account);
    let rows = '';
    account.forEach((acc) => {
      rows += `<tr class="row">
       <td class="table-cell">${icons[acc.icon_id]}&nbsp;&nbsp;${acc.name}</td>
       <td class="table-cell">${acc.currency}</td>
       <td class="table-cell">${toLocaleFixed(acc.initial_balance)}</td>
       <td class="table-cell">${acc.include_in_total}</td>
      </tr>
      `.replace(/\s+/g, ' ');
    });
    document.querySelector(UISelector.table).insertAdjacentHTML('beforeend', rows);
  }


  function clearTable() {
    const table = document.querySelector(UISelector.table);
    while (table.firstChild) table.removeChild(table.firstChild);
  }

  return {
    initAccountView: function(data) {
      renderAccountList(data.account);
    },

    clear: function() {
      clearTable();
    }
  }
})();


ipcRenderer.on('account:view:init', (_, data) => {
  console.log(data);
  AccountUI.initAccountView(data);
});

window.addEventListener('message', (e) => {
  if (e.data === 'account:view:clear') {
    AccountUI.clear();
  }
});