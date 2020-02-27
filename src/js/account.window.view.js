'use strict';
const { ipcRenderer, remote } = require('electron');
const { icons } = require('./constant')

const UI = (function() {
  const UIselectors = {
    iconBox: '.select__radio--box',
    form: 'account-form',
    cancelBtn: 'cancel'
  }

  return {
    init: function() {
      let html = '';
      let count = 0;
      icons.forEach((icon) => {
        html += `<input type="radio" name="iconid" id="icon-${count}" value="${count}" ${(count === 0) ? 'checked' : ''} autofocus>
            <label for="icon-${count}" tabindex="0"  class="select__radio--box-item">${icon}</label>`
          .replace(/\s+/g, ' ');
        count++;
      });
      document.querySelector(UIselectors.iconBox).insertAdjacentHTML('beforeend', html);
    },

    addCancelButtonListener: function () {
      document.getElementById(UIselectors.cancelBtn).addEventListener('click', (e) => {
        remote.getCurrentWindow().close();
      })
    },

    addFormListener: function() {
      document.getElementById(UIselectors.form).addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const result = {};
        for (let [key, value] of formData.entries()) {
          console.log(`${key}:${value}`);
          if (key === 'amount') result[key] = value.replace(/\,/g, '');
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
UI.addFormListener();

