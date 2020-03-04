'use strict';
const { CountryISO } = require('./country.iso');

const Config = (function() {
  let deviceHash = null;
  let baseCurrency = null;
  let countryCode = null;

  return {
    initDefault: function() {
      let local = CountryISO.getLocal();
      baseCurrency = local;
    },

    getBaseCurrency: function() {
      return baseCurrency;
    }
  }
})();

module.exports = Config;