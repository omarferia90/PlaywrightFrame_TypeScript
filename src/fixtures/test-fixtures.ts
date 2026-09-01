import { test as base, type TestInfo } from '@playwright/test';
import { LoginPage } from '../pages/login/login.page';
import { ProductsApi } from '../api/products/products.api';



type Fixtures = {
  tearDown: void;
  testInfo: TestInfo;
  loginPage: LoginPage;
  productsApi: ProductsApi;
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
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  productsApi: async ({ request }, use) => {
    await use(new ProductsApi(request));
  },
});

export { expect } from '@playwright/test';
