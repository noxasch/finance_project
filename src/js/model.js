// handle model integration
'use strict';
const { ModelSQLite} = require('./model.sqlite');
const { TransactionHelper } = require('./transaction.helper');

const Model = (function() {
  let lastItemId = null; 
  let account = null; // temp storage
  let totalBalance = null;

  function resetAccount(data) {
    account = data;
  }
  return {
    init: function(dbname) {
      ModelSQLite.init(dbname);
      ModelSQLite.createTableAccount();
      ModelSQLite.createTableTransaction();
      resetAccount(ModelSQLite.getAccount());
    },


    addTransaction: function(inputObj) {
      let lastInsertRowid = null;
      console.log('INPUT OBJ: ', inputObj);
      const processed = TransactionHelper.processInput(inputObj, lastItemId, account);
      console.log('PROCESSED:', processed);
      if (processed.length > 1) {
        lastInsertRowid = ModelSQLite.addMultipleTransaction(processed);
        // console.log(lastInsertRowid);
        return ModelSQLite.getTransactionsByTransferId(processed[0].transferId);
      }
      if (processed.length === 1) {
        lastInsertRowid = ModelSQLite.addTransaction(processed[0]);
        return ModelSQLite.getTransactionById(lastInsertRowid);
      }
    },

    getAllTransaction: function(limit = null) {
      const results = ModelSQLite.getAllTransaction(limit);
      lastItemId = results.length;
      // console.log('model\n',results);
      return results
    },

    getTransaction: function(itemId) {
      let row = ModelSQLite.getTransactionById(itemId);
      // console.log(row);
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

    getAccountBalance: function(accountId = null) {
      let res = ModelSQLite.getAccountBalance(accountId);
      console.log(res);
      return res;
    },

    getTotalBalance: function() {
      let res = ModelSQLite.getAccountBalance();
      console.log(res);
      if (res !== undefined) return res.total_balance;
    }
  }
})();

module.exports = { Model };