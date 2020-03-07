'use strict';
const { ipcRenderer, remote } = require('electron');
const app = require('electron').remote.app;
const { icons } = require('./constant');
const { CountryISO } = require('./country.iso');

const UI = (function() {
  const UIselectors = {
    iconBox: '.select__radio--box',
    form: 'account-form',
    cancelBtn: 'cancel',
    name: 'name',
    currency: 'currency',
    include: 'include',
    notInclude: 'not-include',
    initialBalance: 'initial'
  }

  function initCurrencyOption() {
    const select = document.getElementById(UIselectors.currency);
    const local = app.getLocaleCountryCode();
    const data = CountryISO.getList();
    const fragment = document.createDocumentFragment();
    data.forEach((item) => {
      const opt = document.createElement('option');
      opt.dataset.id = item.id;
      opt.value = item.currency;
      opt.textContent = item.currency;
      if (item.ISO_2 === local) opt.selected = true;
      fragment.appendChild(opt);
    });
    select.appendChild(fragment);
  }

  function initIcons() {
    let html = '';
    let count = 0;
    icons.forEach((icon) => {
      html += `<input type="radio" name="iconid" id="icon-${count}" value="${count}" ${(count === 0) ? 'checked' : ''} autofocus>
            <label for="icon-${count}" tabindex="0"  class="select__radio--box-item">${icon}</label>`
        .replace(/\s+/g, ' ');
      count++;
    });
    document.querySelector(UIselectors.iconBox).insertAdjacentHTML('beforeend', html);
  }

  function initBalance() {
    document.getElementById(UIselectors.initialBalance).value = '0.00';
  }

  return {
    init: function() {
      initIcons();
      initCurrencyOption();
      initBalance();
    },

    addCancelButtonListener: function () {
      document.getElementById(UIselectors.cancelBtn).addEventListener('click', (e) => {
        remote.getCurrentWindow().close();
      });
    },

    addCheckBoxListener: function() {
      document.getElementById(UIselectors.include).addEventListener('change', (e) => {
        if (e.target.checked === false) {
          document.getElementById(UIselectors.notInclude).checked = true;
        } else {
          document.getElementById(UIselectors.notInclude).checked = false;
        }
      });
    },

    addFormListener: function() {
      document.getElementById(UIselectors.form).addEventListener('submit', (e) => {
        e.preventDefault();
        let formData = new FormData(e.target);
        let result = {};
        for (let [key, value] of formData.entries()) {
          console.log(`${key}:${value}`);
          if (key === 'initial') result[key] = value.replace(/\,/g, '');
          else result[key] = value;
        }
        console.log(result);
        ipcRenderer.send('add:account', result);
        remote.getCurrentWindow().close();
      });
    }
  }
})();

UI.init();
UI.addCancelButtonListener();
UI.addCheckBoxListener();
UI.addFormListener();
// let code = app.getLocaleCountryCode();
// console.log('Country Code', code);
// console.log(process.type);

