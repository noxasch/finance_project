// handle model integration
'use strict';
const { ModelSQLite} = require('./model.sqlite');
const { TransactionHelper } = require('./transaction.helper');

const Model = (function() {
  let lastItemId = null; 
  let account = null; // temp storage
  // let totalBalance = null;

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
      // console.log('INPUT OBJ: ', inputObj);
      const result = TransactionHelper.processInput(inputObj, lastItemId, account);
      // console.log('PROCESSED:', result);
      if (result.length > 1) {
        lastInsertRowid = ModelSQLite.addMultipleTransaction(result);
        // console.log(lastInsertRowid);
        return ModelSQLite.getTransactionsByTransferId(result[0].transferId);
      }
      if (result.length === 1) {
        lastInsertRowid = ModelSQLite.addTransaction(result[0]);
        return ModelSQLite.getTransactionById(lastInsertRowid);
      }
      lastItemId = lastInsertRowid;
    },

    getAllTransaction: function(limit = null) {
      const results = ModelSQLite.getAllTransaction(limit);
      // const results = []
      // results.forEach
      lastItemId = results[0].lastRowId;
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

    deleteTransaction: function(item) {
      // if (item)
      // console.log('model.js', item);
      // let currItem = item;
      if (item.transfer_id !== null) {
        // console.log(item.transfer_id);
        ModelSQLite.purgeTransactionByTransferId(item.transfer_id);
      } else {
        ModelSQLite.purgeTransactionById(item.id);
      }
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