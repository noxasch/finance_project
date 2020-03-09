'use strict';
const path = require('path');
const { ipcMain } = require('electron');
const { WindowDialog } = require('./window.helper');

let dialogWindow = null;
let accountWindow = null;
let transactionId = null;

function registerListener(db, config, mainWindow) {
  ipcMain.on('home:ready', (event) => {
    const data = {
      balance: db.getAccountBalance().total_balance,
      transactions: db.getAllTransaction(10),
      account: db.getAccount(),
      baseCurrency: config.getBaseCurrency()
    }
    mainWindow.send('home:init', data);
  });

  ipcMain.on('transaction:add', (event, results) => {
    console.trace('ADD TRANSACTION: ', results);
    const newTransaction = db.addTransaction(results);
    const data = {
      account: db.getAccount(),
      transactions: db.getAllTransaction(10),
      newTransaction: newTransaction
    };
    mainWindow.send('transaction:new', data);
  });

  ipcMain.on('transaction:delete', (event, itemId) => {
    // console.trace('delete', itemId);
    db.deleteTransaction(itemId);
    const data = {
      account: db.getAllAccount(),
      transactions: db.getAllTransaction()
    };
    event.sender.send('transaction:init', data);
  });

  ipcMain.on('transaction:window', (event, itemId) => {
    transactionId = itemId;
    dialogWindow = WindowDialog.createUpdateDialog(mainWindow, path.join('file://', path.resolve(__dirname, '..'), 'html', 'update.window.html'));
  });

  ipcMain.on('transaction:window:ready', (event) => {
    const data = {
      account: db.getAllAccount(),
      transaction: db.getTransaction(transactionId),
    };
    console.trace('UPDATE', data);
    event.sender.send('data:init', data);
  });

  ipcMain.on('transaction:update', (event, result) => {
    db.updateTransaction(result);
    transactionId = null;
    // console.trace(event);
    const data = {
      account: db.getAllAccount(),
      transactions: db.getAllTransaction(),
    };
    mainWindow.send('transaction:init', data);
  });

  ipcMain.on('account:window', (_) => {
    accountWindow = WindowDialog.createAccountDialog(mainWindow, path.join('file://', path.resolve(__dirname, '..'), 'html', 'account.window.html'));
  });

  ipcMain.on('account:add', (_, result) => {
    // console.trace(result);
    // db.addAccount(result);
    try {
      let accountId = db.addAccount(result);
      // console.trace(accountId);
      let account = db.getAccount(accountId);
      mainWindow.send('account:init', db.getAccount());
      // mainWindow.send('index:update', account);
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        console.error('Error: Account with the same name already exist');
      } else {
        throw error; // unexpected error
      }
    }
    // mainWindow.send('account:init', db.getAccount());
  });

}

module.exports = registerListener;