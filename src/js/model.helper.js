'use strict';

const ModelHelper = (function() {
  // handle business logic and return results
  // should be unit testable
  // model will pass the return value to Model DBInterface
  return {

    /**
     * 
     * @param {Object} inputObj 
     * @param {number} lastItemId 
     * @param {array} account
     */
    processNew: function(inputObj, lastItemId, account) {
      const result = [];
      const item = {
        label: inputObj['label'],
        amount: parseFloat(inputObj['amount']),
        type: parseInt(inputObj['transaction-input']),
        operation: parseInt(inputObj['transaction-input']),
        categoryId: parseInt(inputObj['transaction-input']),
        datetime: inputObj['date-input'],
        dateAdded: inputObj['date-input'],
        dateUpdated: '',
        transferId: null
      }

      if (inputObj['transaction-input'] === '0') { // expense - withdraw
        item['accountId'] = parseInt(inputObj['account-input-from']);
      } else if (inputObj['transaction-input'] === '1') { // income - deposit
        item['accountId'] = parseInt(inputObj['account-input-to']);
      } else if (inputObj['transaction-input'] === '2') {

        obj['accountId'] = parseInt(inputObj['account-input-from']);
        obj.label = `Transfer from ${account[parseInt(inputObj['account-input-from'])]}`;
        obj.operation = 0; // withdraw
        obj['id'] = data.length + 1;
        transferId = obj.id;
        obj.transferId = lastItemId + 1;
        result.push(item);

        const itemTwo = item;
        itemTwo.operation = 1;
        itemTwo.accountId = parseInt(inputObj['account-input-to']);
        itemTwo.label = `Transfer from ${account[parseInt(inputObj['account-input-to'])]}`;
        result.push(itemTwo);
      } 

      return result;
    },

    processUpdate: function(inputObj) {
      const transactionObj = {
        id: inputObj.id,
        label: inputObj.label,
        amount: parseFloat(inputObj.amount),
        accountId: inputObj.accountId,
        type: inputObj.type,
        category: inputObj.category,
        datetime: inputObj.datetime
      }
      if (transactionObj.type === 0)
        transactionObj['operation'] = 0;
      if (transactionObj.type === 1)
        transactionObj['operation'] = 1;
      return [transactionObj];
    },

    processDelete: function(itemId) {
      // get item from db
      // check if transfer delete by transferId
      // else delete by id
    }
  }
})();

module.exports = { ModelHelper };