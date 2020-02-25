// business logic and take db input from main
'use strict';
const { ModelSQLite} = require('./model.sqlite');
const { ModelHelper } = require('./model.helper');

const Model = (function() {
  let lastItemId = null;
  let account = null;
  return {
    init: function(dbname) {
      ModelSQLite.init(dbname);
      ModelSQLite.createTableAccount();
      ModelSQLite.createTableTransaction();
    },

    addTransaction: function(inputObj) {
      let lastInsertRowId = null;
      const processed = ModelHelper.processNew(inputObj, lastItemId, account);
      if (processed.length > 0) {
        lastInsertRowId = ModelSQLite.addMultipleTransaction(processed);
        return ModelSQLite.getTransactionsByTransferId(processed[0].transferId);
      }
      if (processed.length === 1) {
        lastInsertRowId = ModelSQLite.addTransaction(processed[0]);
        return ModelSQLite.getTransactionById(lastInsertRowId);
      }
    },

    getAllTransaction: function(limit = null) {
      const results = ModelSQLite.getAllTransaction(limit);
      lastItemId = results.length;
      return results
    },

    insertTransaction: function(itemId) {
      return ModelSQLite.getTransactionById(itemId);
    },

    updateTransaction: function(input) {
      ModelSQLite.updateTransaction(input);
      return true;
    },

    deleteTransaction: function(itemId) {
      ModelSQLite.purgeTransaction(itemId);
      return true;
    },

    addAccount: function (inputObj) {
      ModelSQLite.addTransaction(inputObj);
      return true;
    },

    getAllAccount: function () {
      account = ModelSQLite.getAllAccount();
      return account;
    },

    deleteAccount: function(itemId) {
      ModelSQLite.purgeAccount(itemId);
      return true;
    }

  }
})();

module.exports = { Model };