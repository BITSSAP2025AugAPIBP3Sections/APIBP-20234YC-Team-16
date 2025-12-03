exports.config = {
  runner: 'local',
  specs: ['./specs/**/*.spec.js'],
  maxInstances: 1,
  capabilities: [{
    browserName: 'chrome',
    'goog:chromeOptions': {
      // headless for CI
      args: process.env.CI ? ['--headless=new','--no-sandbox','--disable-dev-shm-usage'] : []
    }
  }],
  logLevel: 'error',
  bail: 0,
  baseUrl: 'http://localhost:3000',
  waitforTimeout: 10000,
  connectionRetryCount: 0,
  services: ['devtools'], // DevTools avoids chromedriver
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000
  }
};
