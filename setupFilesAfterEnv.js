/* Set default timeout for all tests. */
const TEST_TIMEOUT = 2 * 60 * 1000;
jest.setTimeout(TEST_TIMEOUT);

/* Set base URL for all tests */
global.baseUrl = 'https://demo.applitools.com';

/* Set the environment for the current test */
global.appName = 'applitoolsDemo';
global.ELEMENT_TIMEOUT = 5000;
