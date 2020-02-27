const path = require('path');
const Application = require('spectron').Application;
const electron = require('electron');

describe('App launch', function() {
  jest.setTimeout(5000);
  let app = null;
  // let app = new Application({
  //   path: electron,
  //   args: path.join(__dirname, '..', 'src', 'js', 'main.js')
  // });

  beforeAll(function () {
    app = new Application({
      path: electron,
      args: [path.join(__dirname, '..', 'src', 'js', 'main.js')]
    });
    return app.start();
  });

  afterAll(function() {
    if (app && app.isRunning()) {
      return app.stop();
    }
  });

  test('init', async function() {
    return app.client.getWindowCount().then(function(count) {
      expect(count).toEqual(1);
    })
  });

  test('init', async function() {
    return app.client.getTitle().then((title) => {
      expect(title).toEqual('Finance App');
    })
  });
});

