'use strict';

const path = require('path');
const { app, BrowserWindow } = require('electron');
// const { DummyDB } = require('./model.reference');
const { Model } = require('./model');
const registerListener = require('./main.listener');
// const { CountryISO } = require('./country.iso');
const Config = require('./config');
const { files } = require('./constant');

let mainWindow = null;
// const dbname = files.databaseFile;

// Config.initDefault();
const model = Model;
model.init(files.databaseFile);

function initMain() {
  const windowOptions = {
    show: false,
    width: 1000,
    height: 650,
    // height: 800,
    minWidth: 1000,
    minHeight: 650,
    title: app.name,
    opacity: 0.98,
    webPreferences: {
      defaultFontSize: Config.getConfig().fontSize,
      nodeIntegration: true
    }
  }

  function createMainWindow() {
    mainWindow = new BrowserWindow(windowOptions);
    mainWindow.loadURL(path.join('file://', path.resolve(__dirname, '..'), 'html', 'index.html'));
    mainWindow.on('ready-to-show', () => {
      mainWindow.send('account:init', model.getAccount());
      mainWindow.show();
      // send data here
      // mainWindow.webContents.openDevTools();
    });

    mainWindow.on('closed', () => {
      mainWindow = null;
    });
  }
  app.disableHardwareAcceleration();
  app.on('ready', () => {
    createMainWindow();
    // const db = Model;
    // db.init(dbname);
    // const db = DummyDB;
    registerListener(model, Config, mainWindow);
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
