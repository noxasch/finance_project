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
        categoryId: parseInt(inputObj['transaction-input']), // update category
        datetime: inputObj['date-input'],
        dateAdded: inputObj['date-input'],
        dateUpdated: '',
        transferId: null
      }

      switch (inputObj['transaction-input']) {
        case '0':
          item['accountId'] = parseInt(inputObj['account-input-from']);
          result.push(item);
          break;
        case '1':
          item['accountId'] = parseInt(inputObj['account-input-to']);
          result.push(item);
          break;
        case '2':
          item['accountId'] = parseInt(inputObj['account-input-from']);
          item.label = `Transfer from ${account[parseInt(inputObj['account-input-from'])].name}`;
          item.operation = 0; // withdraw
          item.transferId = lastItemId + 1;
          result.push(item);
          // console.log(item);
          const itemTwo = JSON.parse(JSON.stringify(item));
          itemTwo.operation = 1;
          itemTwo.accountId = parseInt(inputObj['account-input-to']);
          itemTwo.label = `Transfer to ${account[parseInt(inputObj['account-input-to'])].name}`;
          result.push(itemTwo);
          break;
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
      return transactionObj;
    },

  }
})();

module.exports = { ModelHelper };