'use strict';
const { ipcRenderer } = require('electron');
const toggle = document.getElementById('right-toggle');
const rightMenu = document.querySelector('.grid-container__right');
const btn_account = document.getElementById('addaccount');

// nav
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

// toggle quickMenu
toggle.addEventListener('change', function () {
  if (toggle.checked) {
    rightMenu.classList.add('show');
  } else {
    rightMenu.classList.remove('show');
  }
});

// add account
btn_account.addEventListener('click', (e) => {
  ipcRenderer.send('window:account');
});

// update data
ipcRenderer.on('index:update', (_, result) => {
  console.log(result);
});