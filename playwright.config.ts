import { defineConfig, devices } from '@playwright/test';
import { activeEnvironment } from './src/config/environments';


/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  timeout: 60000, //whole test (including hooks in that test) must finish in 60 seconds
  expect: { timeout: 10000, }, //each expect statement must finish in 10 seconds
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html']],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: activeEnvironment.baseUrl,
    actionTimeout: 15000,      // click, fill, check, etc in 10 seconds
    navigationTimeout: 30000,  // page.goto, reload, waitForURL in 30 seconds
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'ui-chromium',
      testDir: './tests/ui',
      use: { 
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: ['--disable-features=PasswordLeakDetection,PasswordManagerOnboarding'],
        },
      },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: { },
    },
  ],
});
