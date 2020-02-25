'use strict';

const path = require('path');
const { app, BrowserWindow } = require('electron');
// const { DummyDB } = require('./model.reference');
const { Model } = require('./model');
const registerListener = require('./main.listener');

let mainWindow = null;
const dbname = 'test.db';

function initMain() {
  const windowOptions = {
    show: false,
    width: 1000,
    height: 650,
    title: app.name,
    opacity: 0.98,
    webPreferences: {
      defaultFontSize: 14,
      nodeIntegration: true
    }
  }

  function createMainWindow() {
    mainWindow = new BrowserWindow(windowOptions);
    mainWindow.loadURL(path.join('file://', path.resolve(__dirname, '..'), 'html', 'index.html'));

    mainWindow.on('ready-to-show', () => {
      mainWindow.show();
    })
    mainWindow.on('closed', () => {
      mainWindow = null;
    });
  }

  app.on('ready', () => {
    createMainWindow();
    const model = Model;
    model.init(dbname);
    // const db = DummyDB;
    registerListener(model, mainWindow);
  }); // when app is ready

  app.on('window-all-closed', () => {
    app.quit();
    // if (process.platform !== 'darwin')
    //   app.quit();
  });

  app.on('activate', () => {
    if (mainWindow === null)
      createMainWindow();
    // console.log('app:activate');
  });
}

// init main process
//  - make single instance (if needed)
//  - load local js module
//  - create mainWindow 
// main
initMain();
// const db = new Database('people.db');
// const stmt = db.prepare('SELECT COUNT(*) FROM sqlite_master WHERE type=?');
// console.log(stmt.get('table'));

process.on('uncaughtException', (err) => {
  console.error((new Date).toLocaleString(), 'Uncaught Exception:', err.message);
  console.error(err.stack);
  // process.exit(1); // this will close the APP if something weird happen
});
