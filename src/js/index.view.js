'use strict';
const toggle = document.getElementById('right-toggle');
const rightMenu = document.querySelector('.grid-container__right');

toggle.addEventListener('change', function () {
  if (toggle.checked) {
    rightMenu.classList.add('show');
  } else {
    rightMenu.classList.remove('show');
  }
});