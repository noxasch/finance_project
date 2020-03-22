'use strict';
const path = require('path');
const { ipcMain } = require('electron');
const { WindowDialog } = require('./window.helper');

let dialogWindow = null;
let accountWindow = null;
let transactionId = null;



function registerListener(db, config, mainWindow) {

  function updateTransactionToHomeView() {
    const data = {
      transactions: db.getAllTransaction(10),
      account: db.getAccount(),
      baseCurrency: config.getBaseCurrency()
    }
    mainWindow.send('home:init', data);
  }

  ipcMain.on('home:view:ready', (event) => {
    updateTransactionToHomeView();
  });

  ipcMain.on('transaction:add', (event, results) => {
    // console.log('ADD TRANSACTION: ', results);
    db.addTransaction(results);
    const data = {
      transactions: db.getAllTransaction(10),
      account: db.getAccount(),
      // baseCurrency: config.getBaseCurrency()
    }
    mainWindow.send('home:transaction:update', data);
  });

  ipcMain.on('transaction:delete', (event, itemId) => {
    console.log('delete', itemId);
    db.deleteTransaction(itemId);
    updateTransactionToHomeView();
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
    console.log('UPDATE', data);
    event.sender.send('data:init', data);
  });

  // ipcMain.on('transaction:update', (event, result) => {
  //   db.updateTransaction(result);
  //   transactionId = null;
  //   // console.log(event);
  //   const data = {
  //     account: db.getAllAccount(),
  //     transactions: db.getAllTransaction(),
  //   };
  //   mainWindow.send('transaction:init', data);
  // });

  ipcMain.on('account:window', (_) => {
    accountWindow = WindowDialog.createAccountDialog(mainWindow, path.join('file://', path.resolve(__dirname, '..'), 'html', 'account.window.html'));
  });

  ipcMain.on('account:add', (_, result) => {
    // console.log(result);
    // db.addAccount(result);
    try {
      db.addAccount(result);
      // let accountId = db.addAccount(result);
      // console.log(accountId);
      // let account = db.getAccount(accountId);
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

  // sections listener
  ipcMain.on('account:view:ready', (_) => {
    const data = {
      account: db.getAccount(),
    }
    mainWindow.send('account:view:init', data);
  });

}

module.exports = registerListener;
