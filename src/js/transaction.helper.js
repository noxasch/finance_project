'use strict';

module.exports.TransactionHelper = (function() {
  // handle business logic and return results
  // should be unit testable
  // model will pass the return value to Model DBInterface
  return {

    /**
     * @param {Object} inputObj 
     * @param {number} lastItemId 
     * @param {array} account
     */
    processInput: function(inputObj, lastItemId, account) {
      const result = [];
      console.trace('PROCESSING:',inputObj);
      const item = {
        label: inputObj['label'],
        type: parseInt(inputObj['transaction-type']),
        categoryId: parseInt(inputObj['category']), // update category
        transaction_date: inputObj['date'],
        transferId: null,
        // ex_rate: null
      }

      switch (inputObj['transaction-type']) {
        case '0':
          console.trace('CASE 0');
          item['accountId'] = parseInt(inputObj['account-from']);
          item['amount'] = parseFloat(`-${inputObj['amount-from']}`);
          item['operation'] = 0;
          result.push(item);
          break;
        case '1':
          console.trace('CASE 1');
          item['accountId'] = parseInt(inputObj['account-to']);
          item['amount'] = parseFloat(inputObj['amount-to']);
          item['operation'] = 1;
          result.push(item);
          break;
        case '2':
          console.trace('CASE 2');
          item['accountId'] = parseInt(inputObj['account-from']);
          item.amount = parseFloat(`-${inputObj['amount-from']}`);
          item.label = `Transfer from ${account[parseInt(inputObj['account-from'])].name}`;
          item['operation']= 0; // withdraw
          item.transferId = lastItemId + 1;
          result.push(item);
          // console.trace(item);
          const itemTwo = JSON.parse(JSON.stringify(item));
          itemTwo.amount = parseFloat(inputObj['amount-to']);
          itemTwo['operation'] = 1;
          itemTwo.accountId = parseInt(inputObj['account-to']);
          itemTwo.label = `Transfer to ${account[parseInt(inputObj['account-to'])].name}`;
          result.push(itemTwo);
          break;
      }
      console.trace(result)
      return result;
    },

    processUpdate: function(inputObj) {
      const transactionObj = {
        id: inputObj.id,
        label: inputObj.label,
        amount: parseFloat(inputObj.amount),
        accountId: inputObj.accountId,
        type: inputObj.transaction_date,
        category: inputObj.category,
        transaction_date: inputObj.transaction_date
      }
      if (transactionObj.transaction_date === 0)
        transactionObj['operation'] = 0;
      if (transactionObj.transaction_date === 1)
        transactionObj['operation'] = 1;
      return transactionObj;
    },

    processExpenseInput: function() {

    },

    processIncomeInput: function() {

    },

    processTransferInput: function() {

    }

  }
})();
