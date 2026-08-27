# Data Handling and Environment Variables

## Environment variables

```
# .env.example
BASE_URL=https://qa.example.com
API_BASE_URL=https://api-qa.example.com
TEST_USER_EMAIL=qa.user@example.com
TEST_USER_PASSWORD=changeme
```

Typed reading, never scattered `process.env.X` calls throughout the code:

```typescript
// src/utils/env.ts
function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

export const env = {
  baseUrl: required('BASE_URL'),
  apiBaseUrl: required('API_BASE_URL'),
  testUser: {
    email: required('TEST_USER_EMAIL'),
    password: required('TEST_USER_PASSWORD'),
  },
} as const;
```

`playwright.config.ts` loads `.env` with `dotenv` and uses `env.baseUrl` for `use.baseURL`.

## Per-environment config (dev/qa/staging)

If the user needs to run against multiple environments (not just QA), use an environment map instead of multiple `.env` files:

```typescript
// src/config/environments.ts
type Environment = 'dev' | 'qa' | 'staging';

const environments: Record<Environment, { baseUrl: string; apiBaseUrl: string }> = {
  dev: { baseUrl: 'https://dev.example.com', apiBaseUrl: 'https://api-dev.example.com' },
  qa: { baseUrl: 'https://qa.example.com', apiBaseUrl: 'https://api-qa.example.com' },
  staging: { baseUrl: 'https://staging.example.com', apiBaseUrl: 'https://api-staging.example.com' },
};

const current = (process.env.TEST_ENV as Environment) ?? 'qa';
export const activeEnvironment = environments[current];
```

This way, running against another environment is just `TEST_ENV=staging npx playwright test`, with no code changes and no per-environment `.env` files.

## Typed test data

Never hardcode data inside the `.spec.ts` file. Use `fixtures/data/`:

```typescript
// src/fixtures/data/claims.data.ts
export interface ClaimTestData {
  claimNumber: string;
  status: 'open' | 'closed' | 'pending';
}

export const validClaim: ClaimTestData = {
  claimNumber: 'CLM-000123',
  status: 'open',
};
```

```typescript
// tests/ui/claims/claims-search.spec.ts
import { validClaim } from '../../../src/fixtures/data/claims.data';

test('searches for an existing claim @smoke', async ({ claimsSearchPage }) => {
  await claimsSearchPage.searchByClaimNumber(validClaim.claimNumber);
  await claimsSearchPage.expectClaimVisible(validClaim.claimNumber);
});
```

## Playwright fixtures with injected Page Objects/API clients

```typescript
// src/fixtures/test-fixtures.ts
import { test as base } from '@playwright/test';
import { ClaimsSearchPage } from '../pages/claims/claims-search.page';
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
```

Tests import `test`/`expect` from this file (not directly from `@playwright/test`), so they receive already-instantiated Page Objects/API clients without scattered `new` calls in every test.