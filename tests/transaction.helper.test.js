const { TransactionHelper  } = require('../src/js/transaction.helper');

const account = [
  { id: 1, name: 'Wallet', iconId: 1 },
  { id: 2, name: 'Bank', iconId: 2 },
];

test('processInput Expense', () => {
  const inputExpense = {
    'label': 'test expense',
    'amount-from': '10',
    'account-from': '1',
    'transaction-type': '0',
    'date': '2020-02-12',
    'category': '0'
  }

  let result = TransactionHelper.processInput(inputExpense, 1, account);
  // console.log(result);
  expect(result.length).toEqual(1);
  expect(result).toEqual([{
    label: inputExpense['label'],
    amount: parseFloat(`-${inputExpense['amount-from']}`),
    transaction_type: parseInt(inputExpense['transaction-type']),
    operation: parseInt(inputExpense['transaction-type']),
    category_id: parseInt(inputExpense['transaction-type']),
    transaction_date: inputExpense['date'],
    transfer_id: null,
    account_id: parseInt(inputExpense['account-from']),
    exchange_rate: null
  }]);
});

test('processInput Income', () => {
  const inputIncome = {
    'label': 'test expense',
    'amount-to': '10',
    'account-to': '1',
    'transaction-type': '1',
    'date': '2020-02-12',
    'category': '0'
  }

  let result = TransactionHelper.processInput(inputIncome, 1, account);
  expect(result.length).toEqual(1);
  expect(result).toEqual([{
    label: inputIncome['label'],
    amount: parseFloat(inputIncome['amount-to']),
    transaction_type: parseInt(inputIncome['transaction-type']),
    operation: parseInt(inputIncome['transaction-type']),
    category_id: parseInt(inputIncome['category']),
    transaction_date: inputIncome['date'],
    transfer_id: null,
    account_id: parseInt(inputIncome['account-to']),
    exchange_rate: null
  }]);
});

// test('processInput Transfer', () => {
//   const inputTransfer = {
//     'label': 'test expense',
//     'amount': 10,
//     'transaction-input': '2',
//     'date-input': '2020-02-12',
//     'account-input-from': '1',
//     'account-input-to': '0'
//   }

//   let result = TransactionHelper.processInput(inputTransfer, 1, account);
//   expect(result.length).toEqual(2);
//   expect(result).toEqual([{
//     label: `Transfer from Bank`,
//     amount: parseFloat(inputTransfer['amount']),
//     type: 2,
//     operation: 0,
//     categoryId: 2,
//     datetime: inputTransfer['date-input'],
//     dateAdded: inputTransfer['date-input'],
//     dateUpdated: '',
//     transferId: 2,
//     accountId: 1
//   },
//   {
//     label: `Transfer to Wallet`,
//     amount: parseFloat(inputTransfer['amount']),
//     type: 2,
//     operation: 1,
//     categoryId: 2,
//     datetime: inputTransfer['date-input'],
//     dateAdded: inputTransfer['date-input'],
//     dateUpdated: '',
//     transferId: 2,
//     accountId: 0
//   }]);
// });

// test('processUpdate withdraw', () => {
//   const inputObj = {
//     id: 2,
//     label: 'Demo Update',
//     amount: '20',
//     accountId: 1,
//     type: 0,
//     category: 1,
//     datetime: '2020-02-12'
//   }
//   const result = TransactionHelper.processUpdate(inputObj);
//   expect(result).toEqual({
//     id: 2,
//     label: 'Demo Update',
//     amount: 20,
//     accountId: 1,
//     type: 0,
//     category: 1,
//     datetime: '2020-02-12',
//     operation: 0
//   });
// });

// test('processUpdate deposit', () => {
//   const inputObj = {
//     id: 2,
//     label: 'Demo Update',
//     amount: '20',
//     accountId: 1,
//     type: 1,
//     category: 1,
//     datetime: '2020-02-12'
//   }
//   const result = TransactionHelper.processUpdate(inputObj);
//   expect(result).toEqual({
//     id: 2,
//     label: 'Demo Update',
//     amount: 20,
//     accountId: 1,
//     type: 1,
//     category: 1,
//     datetime: '2020-02-12',
//     operation: 1
//   });
// });
