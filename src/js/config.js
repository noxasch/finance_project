'use strict';

const Config = (function() {
  // grab from config file
  let deviceHash = null;
  let baseCurrency = 'MYR';
  let countryCode = 'MYS';

  return {
    // initDefault: function() {
    //   let local = CountryISO.getLocal();
    //   baseCurrency = local;
    // },

    getBaseCurrency: function() {
      return baseCurrency;
    }
  }
})();

module.exports = Config;