# Data Handling and Environment Variables

## Environment variables

```
# .env.example
TEST_ENV=qa
TEST_USER_EMAIL=qa.user@example.com
TEST_USER_PASSWORD=changeme
USE_ALLURE=false
```

Credentials stay in `.env` (gitignored). **URLs are not required env vars** in this framework: they come from `src/config/environments.ts` via `TEST_ENV`.

Typed reading, never scattered `process.env.X` calls throughout the code:

```typescript
// src/utils/env.ts
import { activeEnvironment } from '../config/environments';

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

export const env = {
  get baseUrl(): string {
    return activeEnvironment.baseUrl;
  },
  get apiBaseUrl(): string {
    return activeEnvironment.apiBaseUrl;
  },
  get testUser(): { email: string; password: string } {
    return {
      email: required('TEST_USER_EMAIL'),
      password: required('TEST_USER_PASSWORD'),
    };
  },
};
```

`src/config/environments.ts` loads `.env` with `dotenv`. `playwright.config.ts` uses `activeEnvironment.baseUrl` for `use.baseURL`.

## Per-environment config (UI and API may be different apps)

```typescript
// src/config/environments.ts
import dotenv from 'dotenv';

dotenv.config();

export type Environment = 'uat' | 'demo' | 'dev' | 'qa';

const environments: Record<Environment, { baseUrl: string; apiBaseUrl: string }> = {
  uat: {
    baseUrl: 'https://www.saucedemo.com/',
    apiBaseUrl: 'https://automationexercise.com/',
  },
  demo: {
    baseUrl: 'https://www.saucedemo.com/',
    apiBaseUrl: 'https://automationexercise.com/',
  },
  dev: {
    baseUrl: 'https://www.saucedemo.com/',
    apiBaseUrl: 'https://automationexercise.com/',
  },
  qa: {
    baseUrl: 'https://www.saucedemo.com/',
    apiBaseUrl: 'https://automationexercise.com/',
  },
};

function resolveEnvironment(): Environment {
  const key = (process.env.TEST_ENV as Environment | undefined) ?? 'qa';
  if (!(key in environments)) {
    throw new Error(
      `Unknown TEST_ENV "${process.env.TEST_ENV}". Expected one of: ${Object.keys(environments).join(', ')}`,
    );
  }
  return key;
}

export const activeEnvironment = environments[resolveEnvironment()];
```

Running against another named env is `TEST_ENV=uat npx playwright test`. When a real client project replaces the demos, change the URLs in this map — do not hardcode hosts in Page Objects or specs.

## Typed test data

Never hardcode data inside the `.spec.ts` file. Use `fixtures/data/` (and `env.testUser` for secrets):

```typescript
// src/fixtures/data/users.data.ts
export interface LoginTestData {
  username: string;
  password: string;
}

export const standardUser: LoginTestData = {
  username: 'standard_user',
  password: 'secret_sauce',
};
```

Prefer `env.testUser` when credentials must not live in git. Demo-only users (SauceDemo public accounts) may live in typed data files.

```typescript
// tests/ui/auth/login.spec.ts
import { test } from '../../../src/fixtures/test-fixtures';
import { standardUser } from '../../../src/fixtures/data/users.data';

test('logs in with a valid user @smoke', async ({ loginPage }) => {
  await loginPage.goto();
  await loginPage.login(standardUser.username, standardUser.password);
  await loginPage.expectLoggedIn();
});
```

## Playwright fixtures with injected Page Objects/API clients

```typescript
// src/fixtures/test-fixtures.ts
import { test as base, type TestInfo } from '@playwright/test';
import { LoginPage } from '../pages/auth/login.page';
import { ProductsApi } from '../api/products/products.api';

type Fixtures = {
  testInfo: TestInfo;
  loginPage: LoginPage;
  productsApi: ProductsApi;
};

export const test = base.extend<Fixtures>({
  page: async ({ page, context }, use) => {
    try {
      await use(page);
    } finally {
      if (!page.isClosed()) {
        await page.close();
      }
      await context.close();
    }
  },
  browser: [
    async ({ browser }, use) => {
      await use(browser);
      await browser.close();
    },
    { scope: 'worker' },
  ],
  testInfo: [async ({}, use, testInfo) => {
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
```

Tests import `test`/`expect` from this file (not directly from `@playwright/test`), so they receive already-instantiated Page Objects/API clients without scattered `new` calls in every test. When adding a page or API client, extend this file.

The `page` / `browser` overrides close the headed window after the test/worker. Keep that behavior when editing fixtures unless the user asks otherwise.
