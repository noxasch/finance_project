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
      console.log('PROCESSING:',inputObj);
      const item = {
        label: inputObj['label'],
        transaction_type: parseInt(inputObj['transaction-type']),
        category_id: parseInt(inputObj['category']), // update category
        transaction_date: inputObj['date'],
        transfer_id: null,
        exchange_rate: null
      }

      switch (inputObj['transaction-type']) {
        case '0':
          console.log('CASE 0');
          item['account_id'] = parseInt(inputObj['account-from']);
          item['amount'] = parseFloat(`-${inputObj['amount-from'].replace(',', '')}`);
          item['operation'] = 0;
          result.push(item);
          break;
        case '1':
          console.log('CASE 1');
          item['account_id'] = parseInt(inputObj['account-to']);
          item['amount'] = parseFloat(inputObj['amount-to'].replace(',', ''));
          item['operation'] = 1;
          result.push(item);
          break;
        case '2':
          console.log('CASE 2');
          item['account_id'] = parseInt(inputObj['account-from']);
          item.amount = parseFloat(`-${inputObj['amount-from'].replace(',', '')}`);
          // console.log(account);
          let currentAccount = account.filter((item) => item.id === parseInt(inputObj['account-from']))[0];
          // console.log(currentAccount);
          item.label = `Transfer from ${currentAccount.name}`;
          item['operation']= 0; // withdraw
          item.exchange_rate = parseFloat(inputObj['exrate']);
          item.transferId = lastItemId + 1;
          result.push(item);
          // console.log(item);
          const itemTwo = JSON.parse(JSON.stringify(item));
          itemTwo.amount = parseFloat(inputObj['amount-to'].replace(',', ''));
          itemTwo['operation'] = 1;
          itemTwo.account_id = parseInt(inputObj['account-to']);
          currentAccount = account.filter((item) => item.id === parseInt(inputObj['account-from']))[0];
          itemTwo.label = `Transfer to ${currentAccount.name}`;
          result.push(itemTwo);
          break;
      }
      console.log(result)
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
