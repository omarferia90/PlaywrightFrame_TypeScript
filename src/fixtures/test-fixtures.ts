import { test as base, type TestInfo } from '@playwright/test';
import { ClaimsSearchPage } from '../pages/claim/claims-search.page';
import { ClaimsApi } from '../api/claims/claims.api';

type Fixtures = {
  tearDown: void;
  testInfo: TestInfo;
  claimsSearchPage: ClaimsSearchPage;
  claimsApi: ClaimsApi;
};

export const test = base.extend<Fixtures>({
  page: async ({ page, context }, use) => {
    try {
      // Before each test case
      await use(page);
      // After each test case
    } finally {
      // Page.close() only closes the tab. The headed window lives on context/browser.
      if (!page.isClosed()) {
        await page.close();
      }
      await context.close();
    }
  },
  // Close Chromium after the worker (the full file/run on this worker) finishes.
  browser: [
    async ({ browser }, use) => {
      await use(browser);
      await browser.close();
    },
    { scope: 'worker' },
  ],
  testInfo: [async({}, use, testInfo) => {
    await use(testInfo);
}, { auto: true }],
  claimsSearchPage: async ({ page }, use) => {
    await use(new ClaimsSearchPage(page));
  },
  claimsApi: async ({ request }, use) => {
    await use(new ClaimsApi(request));
  },
});

export { expect } from '@playwright/test';
