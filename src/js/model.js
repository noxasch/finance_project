// handle model integration
'use strict';
const { ModelSQLite} = require('./model.sqlite');
const { TransactionHelper } = require('./transaction.helper');

const Model = (function() {
  let lastItemId = null; 
  let account = null; // temp storage
  let totalBalance = null;
  return {
    init: function(dbname) {
      ModelSQLite.init(dbname);
      ModelSQLite.createTableAccount();
      ModelSQLite.createTableTransaction();
    },

    addTransaction: function(inputObj) {
      let lastInsertRowid = null;
      console.trace('INPUT OBJ: ', inputObj);
      const processed = TransactionHelper.processInput(inputObj, lastItemId, account);
      console.trace('PROCESSED:', processed);
      // if (processed.length > 1) {
      //   lastInsertRowId = ModelSQLite.addMultipleTransaction(processed);
      //   // console.trace(lastInsertRowid);
      //   return ModelSQLite.getTransactionsByTransferId(processed[0].transferId);
      // }
      // if (processed.length === 1) {
      //   lastInsertRowid = ModelSQLite.addTransaction(processed[0]);
      //   return ModelSQLite.getTransactionById(lastInsertRowid);
      // }
    },

    getAllTransaction: function(limit = null) {
      const results = ModelSQLite.getAllTransaction(limit);
      lastItemId = results.length;
      // console.trace('model\n',results);
      return results
    },

    getTransaction: function(itemId) {
      let row = ModelSQLite.getTransactionById(itemId);
      // console.trace(row);
      return row;
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
      return ModelSQLite.addAccount(inputObj);
    },

    // return empty array or array of object
    getAccount: function(accountId = null) {
      let results = ModelSQLite.getAccount(accountId);
      return results;
    },

    // getAllAccount: function () {
    //   account = ModelSQLite.getAllAccount();
    //   return account;
    // },

    deleteAccount: function(itemId) {
      ModelSQLite.purgeAccount(itemId);
      return true;
    },

    getAccountBalance: function(accountId) {
      return ModelSQLite.getAccountBalance(accountId);
    },

    getTotalBalance: function() {
      let res = ModelSQLite.getAccountBalance();
      if (res !== undefined) return res.total_balance;
    }
  }
})();

module.exports = { Model };