'use strict';

const dateFormat = require('dateformat');
const os = require('os');
const {Builder, By} = require('selenium-webdriver');
const {
  BrowserType,
  ClassicRunner,
  Configuration,
  DeviceName,
  Eyes,
  IosDeviceName,
  RectangleSize,
  RunnerOptions,
  ScreenOrientation,
  Target,
  VisualGridRunner
} = require('@applitools/eyes-selenium');
const chrome = require('selenium-webdriver/chrome');
const useVisualGrid = true;

describe('Packers - Ultrafast Grid', () => {
  let runner;
  let eyes;
  let driver;

  beforeEach(async () => {
    runner = useVisualGrid ? new VisualGridRunner(new RunnerOptions().testConcurrency(5)) : new ClassicRunner();
    eyes = new Eyes(runner);

    const conf = new Configuration()
        .setApiKey(process.env.APPLITOOLS_API_KEY)
        .setServerUrl(process.env.APPLITOOLS_SERVER_URL)
        .addBrowser(1920, 1080, BrowserType.CHROME)
        .addBrowser(1920, 1080, BrowserType.FIREFOX)
        .addBrowser(1920, 1080, BrowserType.SAFARI)
        .addBrowser({
          chromeEmulationInfo: {
            deviceName: DeviceName.Nexus_10,
            screenOrientation: ScreenOrientation.PORTRAIT
          }
        })
        .addBrowser({
          iosDeviceInfo: {
            deviceName: IosDeviceName.iPad_Pro_3,
            screenOrientation: ScreenOrientation.PORTRAIT
          }
        });
    eyes.setConfiguration(conf);
    eyes.setBatch(
        `packers-${os.userInfo().username}`,
        `${os.userInfo().username}-${dateFormat(new Date(), 'yyyymd_HHMMss')}`,
        new Date().toUTCString()
    );
    process.env.APPLITOOLS_DONT_CLOSE_BATCHES = 'true';
    const webDriver = await new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options()).build();
    driver = await eyes.open(webDriver, 'UFG tests', 'Packers home page', new RectangleSize(960, 640));
  });

  it('General layout', async () => {
    /* eslint-disable max-len */
    // await driver.get('https://tangent-development.jsonline.com/sports/packers/?gnt-test-sectionfront=heroTiles&gnt-test-navpromo#gnt-disable-x&gnt-disable-taboola');
    await driver.get('https://tangent-development.jsonline.com/sports/packers/?gnt-test-sectionfront=heroTiles&gnt-test-navpromo&gnt-test-navigation#gnt-disable-x&gnt-disable-taboola');
    /* eslint-enable max-len */
    await eyes.check('Navigation bar', Target.region(By.css('.gnt_n')));
  });

  afterEach(async () => {
    await eyes.closeAsync();
    await driver.quit();
    // const testResultsSummary = await runner.getAllTestResults(false);
    // console.log(testResultsSummary.toString());
    (await runner.getAllTestResults(false)).getAllResults().forEach((testResultsContainer) => {
      const exception = testResultsContainer.getException();
      if (exception) {
        throw exception;
      } else {
        console.log(JSON.stringify(testResultsContainer.getTestResults().getUrl()));
      }
    });
  });
});
