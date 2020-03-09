'use strict';
const { BrowserWindow } = require('electron');

const WindowDialog = (function () {

  let updateDialog = null;
  let accountDialog = null;

  const windowOptions = {
    show: false,
    width: 500,
    height: 665,
    webPreferences: {
      defaultFontSize: 14,
      nodeIntegration: true
    }
  }

  return {
    // TODO: add separate method for expense/income and transfer for preoper windows size
    createUpdateDialog: function (parent, filePath) {
      windowOptions['parent'] = parent;
      updateDialog = new BrowserWindow(windowOptions);
      updateDialog.loadURL(filePath);
      updateDialog.on('ready-to-show', () => {
        updateDialog.show();
      })
      updateDialog.on('closed', () => {
        updateDialog = null;
      });
      return updateDialog;
    },

    createAccountDialog: function (parent, filePath) {
      windowOptions['parent'] = parent;
      windowOptions.height = 632;
      accountDialog = new BrowserWindow(windowOptions);
      accountDialog.loadURL(filePath);
      accountDialog.on('ready-to-show', () => {
        accountDialog.show();
      })
      accountDialog.on('closed', () => {
        accountDialog = null;
      });
      return accountDialog;
    }
  }
})();

module.exports = { WindowDialog };