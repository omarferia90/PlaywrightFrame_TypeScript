import { test as base } from '@playwright/test';
import { ClaimsSearchPage } from '../pages/claim/claims-search.page';
import { ClaimsApi } from '../api/claims/claims.api';

type Fixtures = {
  claimsSearchPage: ClaimsSearchPage;
  claimsApi: ClaimsApi;
};

export const test = base.extend<Fixtures>({
  claimsSearchPage: async ({ page }, use) => {
    await use(new ClaimsSearchPage(page));
  },
  claimsApi: async ({ request }, use) => {
    await use(new ClaimsApi(request));
  },
});

export { expect } from '@playwright/test';
