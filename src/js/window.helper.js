'use strict';
const { BrowserWindow } = require('electron');

const UpdateDialog = (function () {

  let dialogWindow = null;

  const windowOptions = {
    show: false,
    width: 500,
    height: 530,
    webPreferences: {
      defaultFontSize: 14,
      nodeIntegration: true
    }
  }

  return {
    createDialogWindow: function (parent, filePath) {
      windowOptions['parent'] = parent;
      dialogWindow = new BrowserWindow(windowOptions);
      dialogWindow.loadURL(filePath);
      dialogWindow.on('ready-to-show', () => {
        dialogWindow.show();
      })
      dialogWindow.on('closed', () => {
        dialogWindow = null;
      });
      return dialogWindow;
    }
  }
})();

module.exports = { UpdateDialog };