const { ModelHelper  } = require('../src/js/model.helper');

const account = [
  { name: 'Wallet', iconId: 1 },
  { name: 'Bank', iconId: 2 },
];

test('processNew Expense', () => {
  const inputExpense = {
    'label': 'test expense',
    'amount': 10,
    'transaction-input': '0',
    'date-input': '2020-02-12',
  }

  let result = ModelHelper.processNew(inputExpense, 1, account);
  expect(result.length).toEqual(1);
  expect(result).toEqual([{
    label: inputExpense['label'],
    amount: parseFloat(inputExpense['amount']),
    type: parseInt(inputExpense['transaction-input']),
    operation: parseInt(inputExpense['transaction-input']),
    categoryId: parseInt(inputExpense['transaction-input']),
    datetime: inputExpense['date-input'],
    dateAdded: inputExpense['date-input'],
    dateUpdated: '',
    transferId: null,
    accountId: parseInt(inputExpense['account-input-from'])
  }]);
});

test('processNew Income', () => {
  const inputIncome = {
    'label': 'test expense',
    'amount': 10,
    'transaction-input': '1',
    'date-input': '2020-02-12',
  }

  let result = ModelHelper.processNew(inputIncome, 1, account);
  expect(result.length).toEqual(1);
  expect(result).toEqual([{
    label: inputIncome['label'],
    amount: parseFloat(inputIncome['amount']),
    type: parseInt(inputIncome['transaction-input']),
    operation: parseInt(inputIncome['transaction-input']),
    categoryId: parseInt(inputIncome['transaction-input']),
    datetime: inputIncome['date-input'],
    dateAdded: inputIncome['date-input'],
    dateUpdated: '',
    transferId: null,
    accountId: parseInt(inputIncome['account-input-from'])
  }]);
});

test('processNew Transfer', () => {
  const inputTransfer = {
    'label': 'test expense',
    'amount': 10,
    'transaction-input': '2',
    'date-input': '2020-02-12',
    'account-input-from': '1',
    'account-input-to': '0'
  }

  let result = ModelHelper.processNew(inputTransfer, 1, account);
  expect(result.length).toEqual(2);
  expect(result).toEqual([{
    label: `Transfer from Bank`,
    amount: parseFloat(inputTransfer['amount']),
    type: 2,
    operation: 0,
    categoryId: 2,
    datetime: inputTransfer['date-input'],
    dateAdded: inputTransfer['date-input'],
    dateUpdated: '',
    transferId: 2,
    accountId: 1
  },
  {
    label: `Transfer to Wallet`,
    amount: parseFloat(inputTransfer['amount']),
    type: 2,
    operation: 1,
    categoryId: 2,
    datetime: inputTransfer['date-input'],
    dateAdded: inputTransfer['date-input'],
    dateUpdated: '',
    transferId: 2,
    accountId: 0
  }]);
});

test('processUpdate withdraw', () => {
  const inputObj = {
    id: 2,
    label: 'Demo Update',
    amount: '20',
    accountId: 1,
    type: 0,
    category: 1,
    datetime: '2020-02-12'
  }
  const result = ModelHelper.processUpdate(inputObj);
  expect(result).toEqual({
    id: 2,
    label: 'Demo Update',
    amount: 20,
    accountId: 1,
    type: 0,
    category: 1,
    datetime: '2020-02-12',
    operation: 0
  });
});

test('processUpdate deposit', () => {
  const inputObj = {
    id: 2,
    label: 'Demo Update',
    amount: '20',
    accountId: 1,
    type: 1,
    category: 1,
    datetime: '2020-02-12'
  }
  const result = ModelHelper.processUpdate(inputObj);
  expect(result).toEqual({
    id: 2,
    label: 'Demo Update',
    amount: 20,
    accountId: 1,
    type: 1,
    category: 1,
    datetime: '2020-02-12',
    operation: 1
  });
});
