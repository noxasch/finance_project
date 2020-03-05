'use strict';
// const { app } = require('electron'); // to use in main process
const app = require('electron').remote.app; // to use in renderer
// TODO: add flag for display
module.exports.CountryISO = (function() {
  const countryinfo = [
    { id: 1, ISO_2: 'MY', ISO_3: 'MYS', currency: 'MYR', symbol: 'RM' },
    { id: 2, ISO_2: 'US', ISO_3: 'USA', currency: 'USD', symbol: '$' }
  ]
  return {

    /**
     * can only be called from main process
     */
    getLocal: function() {
      let code = app.getLocaleCountryCode();
      let item = countryinfo.filter((item) => item.ISO_2 === code);
      if (item.length > 0) return item[0];
    },

    /**
     * 
     * @param {string} code 
     */
    getCountryInfo: function(code) {
      let item = countryinfo.filter((item) => item.ISO_2 === code);
      if (item.length > 0) return item[0];
    },

    getList: function() {
      return countryinfo;
    },

    getItemById: function(id) {
      let item = countryinfo.filter((item) => item.id === id);
      if (item.length > 0) return item[0];
    }
  }
})();

