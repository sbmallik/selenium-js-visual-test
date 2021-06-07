'use strict';

const dateFormat = require('dateformat');
const os = require('os');
const {Builder, By} = require('selenium-webdriver');
const {
  Eyes,
  VisualGridRunner,
  RunnerOptions,
  Target,
  RectangleSize,
  Configuration,
  BrowserType,
  DeviceName,
  ScreenOrientation
} = require('@applitools/eyes-selenium');
const chrome = require('selenium-webdriver/chrome');

describe('DemoApp - Ultrafast Grid', () => {
  let runner;
  let eyes;
  let driver;

  beforeEach(async () => {
    // Create a new chrome web driver
    const options = new chrome.Options();
    if (process.env.CI === 'true') options.headless();

    driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    // Create a runner with concurrency of 1
    const runnerOptions = new RunnerOptions().testConcurrency(5);
    runner = new VisualGridRunner(runnerOptions);

    // Create Eyes object with the runner, meaning it'll be a Visual Grid eyes.
    eyes = new Eyes(runner);

    // Initialize the eyes configuration.
    const conf = new Configuration();

    // You can get your api key from the Applitools dashboard
    conf.setApiKey(process.env.APPLITOOLS_API_KEY);

    // You can set the Applitools test manager URL to access the test results
    conf.setServerUrl(process.env.APPLITOOLS_SERVER_URL);

    // Add browsers with different viewports
    conf.addBrowser(800, 600, BrowserType.CHROME);
    conf.addBrowser(700, 500, BrowserType.FIREFOX);
    conf.addBrowser(1600, 1200, BrowserType.IE_11);
    conf.addBrowser(1024, 768, BrowserType.EDGE_CHROMIUM);
    conf.addBrowser(800, 600, BrowserType.SAFARI);

    // Add mobile emulation devices in Portrait mode
    conf.addDeviceEmulation(DeviceName.iPhone_X, ScreenOrientation.PORTRAIT);
    conf.addDeviceEmulation(DeviceName.Pixel_2, ScreenOrientation.PORTRAIT);

    // set the configuration to eyes
    eyes.setConfiguration(conf);

    // create a new batch info instance and set it to the configuration
    eyes.setBatch(
        `VisualTestDemo-${os.userInfo().username}`,
        `${os.userInfo().username}-${dateFormat(new Date(), 'yyyymd_HHMMss')}`,
        new Date().toUTCString()
    );

    // Ensure batch completion after each run
    process.env.APPLITOOLS_DONT_CLOSE_BATCHES = 'true';
  });

  it('ultraFastTest', async () => {
    // Call Open on eyes to initialize a test session
    await eyes.open(driver, 'Demo App - JS Selenium 4', 'Ultrafast grid demo', new RectangleSize(800, 600));

    // Navigate the browser to the "ACME" demo app.
    // ⭐️ Note to see visual bugs, run the test using the above URL for the 1st run.
    // but then change the above URL to https://demo.applitools.com/index_v2.html
    // (for the 2nd run)
    await driver.get(global.baseUrl);
    // await driver.get(`${global.baseUrl}/index_v2.html`);

    // check the login page with fluent api, see more info here
    // https://applitools.com/docs/topics/sdk/the-eyes-sdk-check-fluent-api.html
    await eyes.check('Login Window', Target.window().fully());

    // This will create a test with two test steps.
    await driver.findElement(By.id('log-in')).click();

    // Check the app page
    await eyes.check('App Window', Target.window().fully());

    // Call Close on eyes to let the server know it should display the results
    await eyes.closeAsync();
  });

  afterEach(async () => {
    // Close the browser.
    await driver.quit();

    // If the test was aborted before eyes.close was called, ends the test as aborted.
    await eyes.abortAsync();

    // we pass false to this method to suppress the exception that is thrown if we
    // find visual differences
    const testSummaryResults = await runner.getAllTestResults(false);
    console.log(testSummaryResults.toString());
    const resultsArray = testSummaryResults.getAllResults();
    resultsArray.forEach((testResultsContainer) => {
      const exception = testResultsContainer.getException();
      if (exception) {
        throw exception;
      } else {
        console.log(JSON.stringify(testResultsContainer.getTestResults()));
      }
    });
  });
});

