'use strict'; 

module.exports.transactionType = ['Expense', 'Income', 'Transfer'];
module.exports.operationType = ['withdrawal', 'deposit'];

const DummyDB = (function() {
  // let data = dummydata.dummydata;
  let data = [{
    id: 1,
    label: 'Expense Item Demo',
    amount: '30',
    accountId: 0, // changing data structure to accomodate transfer type
    type: 0,
    operation: 0,
    category: 0,
    datetime: '2020-02-10',
    dateAdded: '',
    dateUpdated: '',
    transferId: null
  },
  {
    id: 2,
    label: 'Income Item Demo 1',
    amount: '50',
    accountId: 0,
    type: 1,
    operation: 1,
    category: 0,
    datetime: '2020-02-11',
    dateAdded: '',
    dateUpdated: '',
    transferId: null
  },
  {
    id: 3,
    label: 'Income Item Demo 3',
    amount: '20',
    accountId: 0,
    type: 1,
    operation: 1,
    category: 0,
    datetime: '2020-02-12',
    dateAdded: '',
    dateUpdated: '',
    transferId: null
  }];

  let account = ['Wallet'];

  return {
    getAllTransaction: function () {
      return data;
    },

    getTransaction: function (itemId) {
      // console.log(itemId);
      // console.log(typeof itemId);
      return data.filter((item) => item.id === parseInt(itemId));
    },

    getAllAccount: function() {
      return account;
    },

    deleteItem: function(itemId) {
      const itemIndex = data.findIndex((item) => item.id === parseInt(itemId));
      if (itemIndex > -1) {
        const currentItem = data[itemIndex];
        console.log(currentItem);
        if (currentItem.transferId) {
          // transfer
          let itemIndex = data.findIndex((item) => item.transferId === parseInt(currentItem.transferId));
          while (itemIndex > -1) {
            console.log(itemIndex);
            data.splice(itemIndex, 1);
            itemIndex = data.findIndex((item) => item.transferId === parseInt(currentItem.transferId));
          }
        } else {
          data.splice(itemIndex, 1);
        }
      } else {
        console.log('item does not exist in record');
      }
    },
    
    updateTransaction: function (result) {
      const itemIndex = data.findIndex((item) => item.id === parseInt(result.id));
      if (itemIndex > -1) data[itemIndex] = result;
    },
    
    insertTransaction: function(results = {}) {
      const newData = []
      let transferId = null;
      const obj = {
        label: results['label'],
        amount: results['amount'],
        type: parseInt(results['transaction-input']),
        operation: parseInt(results['transaction-input']),
        category: 0,
        datetime: results['date-input'],
        dateAdded: results['date-input'],
        dateUpdated: '',
        transferId: null
      }
      if (results['transaction-input'] === '0') {
        obj['accountId'] = results['account-input-from']; // TODO: Refactor this into a helper function - access result + account list + data list
        obj['id'] = data.length + 1;
        data.push(obj);
        newData.push(obj);
      } else if (results['transaction-input'] === '1') {
        obj['accountId'] = parseInt(results['account-input-to']);
        obj['id'] = data.length + 1;
        data.push(obj);
        newData.push(obj);
      } else if (results['transaction-input'] === '2') {
        obj['accountId'] = parseInt(results['account-input-from']);
        obj.label = `Transfer from ${account[parseInt(results['account-input-from'])]}`;
        obj.operation = 0;
        obj['id'] = data.length + 1;
        transferId = obj.id;
        obj.transferId = transferId; // generate new transferID here
        data.push(obj);
        newData.push(obj);
        const obj2 = {
          label: results['label'],
          amount: results['amount'],
          accountId: parseInt(results['account-input-to']),
          label: `Transfer from ${account[parseInt(results['account-input-to'])]}`,
          type: parseInt(results['transaction-input']),
          operation: 1,
          category: 0,
          datetime: results['date-input'],
          dateAdded: results['date-input'],
          dateUpdated: '',
          transferId: transferId
        }
        obj2['id'] = data.length + 1;
        data.push(obj2);
        newData.push(obj2);
      } else {
        throw ('Unknown transaction');
      }
      // console.log(newData);
      // data = data.concat(newData);
      return newData;
    }
  }
})();

module.exports.DummyDB = DummyDB;