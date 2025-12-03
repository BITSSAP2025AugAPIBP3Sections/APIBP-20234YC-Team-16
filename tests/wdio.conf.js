exports.config = {
  runner: "local",

  specs: ["./specs/**/*.spec.js"],

  maxInstances: 1,

  capabilities: [
    {
      browserName: "chrome",
      "goog:chromeOptions": {
        args: [
          process.env.CI ? "--headless=new" : "",
          "--no-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu"
        ].filter(Boolean)
      }
    }
  ],

  logLevel: "info",
  bail: 0,

  baseUrl: "http://localhost:3000",
  waitforTimeout: 15000,

  services: ["devtools"], // ← THIS FIXES EPERM, NO CHROMEDRIVER NEEDED

  framework: "mocha",
  reporters: ["spec"],

  mochaOpts: {
    ui: "bdd",
    timeout: 60000
  }
};
