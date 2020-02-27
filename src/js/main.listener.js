'use strict';
const path = require('path');
const { ipcMain } = require('electron');
const { WindowDialog } = require('./window.helper');

let dialogWindow = null;
let accountWindow = null;

function registerListener(db, mainWindow) {
  ipcMain.on('webview:ready', (event) => {
    const data = {
      account: db.getAllAccount(),
      transactions: db.getAllTransaction()
    }
    event.sender.send('transaction:init', data);
  });

  ipcMain.on('form:submit', (event, results) => {
    const newTransaction = db.insertTransaction(results);
    const data = {
      account: db.getAllAccount(),
      transactions: db.getAllTransaction(),
      newTransaction: newTransaction
    };
    event.sender.send('transaction:new', data);
  });

  ipcMain.on('delete:item', (event, itemId) => {
    // console.log('delete', itemId);
    db.deleteTransaction(itemId);
    const data = {
      account: db.getAllAccount(),
      transactions: db.getAllTransaction(),
      // newTransaction: null
    };
    // console.log(db.getAllTransaction());
    event.sender.send('transaction:init', data);
  });

  ipcMain.on('update:item', (event, itemId) => {
    // console.log(event);
    // console.log(app.getAppPath());
    // console.log(path.resolve(__dirname));
    // console.log(path.resolve(__dirname, '..'));
    dialogWindow = WindowDialog.createUpdateDialog(mainWindow, path.join('file://', path.resolve(__dirname, '..'), 'html', 'update.window.html'));
    ipcMain.on('dialog:ready', (event) => {
      const itemData = db.getTransaction(itemId)[0];
      dialogWindow.send('data:init', itemData);
    });
  });

  ipcMain.on('form:update', (event, result) => {
    db.updateTransaction(result);
    // console.log(event);
    const data = {
      account: db.getAllAccount(),
      transactions: db.getAllTransaction(),
    };
    mainWindow.send('transaction:init', data);
  });

  ipcMain.on('init:account', (event) => {
    accountWindow = WindowDialog.createAccountDialog(mainWindow, path.join('file://', path.resolve(__dirname, '..'), 'html', 'account.window.html'));
  });

  ipcMain.on('add:account', (event, result) => {
    console.log(result);
    try {
      let accountId = db.addAccount(result);
      // console.log(accountId);
      let account = db.getAccount(accountId);
      mainWindow.send('data:update', account);
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        console.log('Error: Account with the same name already exist');
      } else {
        throw error; // unexpected error
      }
      // console.log(error)
      // console.log('CODE:', error.code);
      // console.log('message:', error.message);
    }

  });

}

module.exports = registerListener;