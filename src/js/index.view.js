'use strict';
const { ipcRenderer } = require('electron');
const toggle = document.getElementById('right-toggle');
const rightMenu = document.querySelector('.grid-container__right');
const btn_account = document.getElementById('addaccount');

let currentSection = '#home';

// nav
window.addEventListener('hashchange', (e) => {
  if (document.querySelector(`${window.location.hash}`) !== null) {
    console.log(window.location.hash);
    console.log(currentSection);
    if (window.location.hash !== currentSection){
      const prevSection = document.querySelector('section.show');
      window.postMessage(`${prevSection.id.replace('#', '')}:view:clear`);
      prevSection.classList.remove('show');
      document.querySelector(`${window.location.hash}`).classList.add('show');
      ipcRenderer.send(`${window.location.hash.replace('#', '')}:view:ready`);
      currentSection = window.location.hash;
    }
  }
  document.querySelector('.menu-box__link.active').classList.remove('active');
  document.querySelector(`.menu-box__link[href="${window.location.hash}"]`).classList.add('active');
  // console.log(document.querySelector('.menu-box__link.active'));
  // console.log(document.querySelector(`.menu-box__ink[href="${window.location.hash}"]`));
  document.getElementById('middle').scrollTo(0, 0);
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
  ipcRenderer.send('account:window');
});

// update data
ipcRenderer.on('index:update', (_, result) => {
  console.log(result);
});