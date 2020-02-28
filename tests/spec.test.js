const path = require('path');
const Application = require('spectron').Application;
const electron = require('electron');

describe('App launch', function() {
  jest.setTimeout(10000);
  // let app = null;
  let app = new Application({
    path: electron,
    args: path.join(__dirname, '..', 'src', 'js', 'main.js')
  });

  beforeEach(function () {
    app = new Application({
      path: electron,
      args: [path.join(__dirname, '..', 'src', 'js', 'main.js')]
    });
    return app.start();
  });

  afterEach(function() {
    if (app && app.isRunning()) {
      return app.stop();
    }
  });

  test('init App, check if sidebar visible', async function() {
    let count = await app.client.getWindowCount();
    expect(count).toEqual(1);
    let title = await app.client.getTitle();
    expect(title).toEqual('Finance App');
    app.client.waitUntilWindowLoaded();
    let visible = await app.client.isVisible('label.toggle-button');
    expect(visible).toBe(true);
    visible = await app.client.isVisible('#transaction-form');
    expect(visible).toBe(false);
    await app.browserWindow.maximize()
    let maximized = await app.browserWindow.isMaximized();
    expect(maximized).toBe(true);
    visible = await app.client.isVisible('#transaction-form');
    expect(visible).toBe(true);
    await app.browserWindow.maximize();
  });

  test('Open Add Account, save empty form and cancel', async function() {
    await app.client.click('#addaccount');
    let count = await app.client.getWindowCount();
    expect(count).toEqual(2);
    await app.client.switchWindow('Account');
    let title = await app.client.getTitle();
    expect(title).toBe('Account');
    let visible = await app.client.isVisible('#account-form');
    expect(visible).toBe(true);
    count = await app.client.click('button[type="submit"]').getWindowCount();;
    expect(count).toBe(2);
    count = await app.client.click('#cancel').getWindowCount();
    expect(count).toBe(1);
  });

});

