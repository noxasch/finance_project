'use strict';
const mainSection = document.getElementById('middle');
const links = document.querySelectorAll('link[rel="import"]')


links.forEach((link) => {
  let template = link.import.querySelector('section');
  let clone = template.cloneNode(true);
  mainSection.appendChild(clone);
});

