'use strict';
const { ipcRenderer } = require('electron');
const toggle = document.getElementById('right-toggle');
const rightMenu = document.querySelector('.grid-container__right');
const btn_account = document.getElementById('addaccount');

toggle.addEventListener('change', function () {
  if (toggle.checked) {
    rightMenu.classList.add('show');
  } else {
    rightMenu.classList.remove('show');
  }
});

btn_account.addEventListener('click', (e) => {
  ipcRenderer.send('init:account');
});

ipcRenderer.on('data:update', (_, result) => {
  console.log(result);
});