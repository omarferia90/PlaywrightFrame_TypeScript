# API Tests

Use Playwright's native `request` context, wrapped in an "API objects" layer equivalent to Page Objects — this way API tests have the same structure and readability as UI tests, and never call `request.get(...)` directly inside the `.spec.ts` file.

## BaseApiClient

```typescript
// src/api/base/base.api.ts
import { APIRequestContext } from '@playwright/test';
import { env } from '../../utils/env';

export abstract class BaseApiClient {
  constructor(protected readonly request: APIRequestContext) {}

  protected get baseUrl(): string {
    return env.apiBaseUrl;
  }
}
```

## Concrete API client

```typescript
// src/api/claims/claims.api.ts
import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApiClient } from '../base/base.api';
import { logStep } from '../../utils/decorators';

export interface CreateClaimPayload {
  claimNumber: string;
  amount: number;
}

export class ClaimsApi extends BaseApiClient {
  constructor(request: APIRequestContext) {
    super(request);
  }

  @logStep('Create claim via API')
  async createClaim(payload: CreateClaimPayload): Promise<APIResponse> {
    return this.request.post(`${this.baseUrl}/claims`, { data: payload });
  }

  @logStep('Get claim by number via API')
  async getClaim(claimNumber: string): Promise<APIResponse> {
    return this.request.get(`${this.baseUrl}/claims/${claimNumber}`);
  }
}
```

## API test

```typescript
// tests/api/claims/claims-crud.spec.ts
import { test, expect } from '../../../src/fixtures/test-fixtures';

test('creates a claim and retrieves it @smoke', async ({ claimsApi }) => {
  const createResponse = await claimsApi.createClaim({
    claimNumber: 'CLM-000999',
    amount: 1500,
  });
  expect(createResponse.ok(), 'Create claim should return 2xx').toBeTruthy();

  const getResponse = await claimsApi.getClaim('CLM-000999');
  expect(getResponse.ok(), 'Get claim should return 2xx').toBeTruthy();

  const body = await getResponse.json();
  expect(body.claimNumber).toBe('CLM-000999');
});
```

## Assertions for API responses using the same logging standard

For status codes or body fields, use a variant of the `assertions-logging.md` helper adapted for responses (instead of locators):

```typescript
// src/utils/logger.ts (add this)
import { APIResponse } from '@playwright/test';

export function assertApiOk(
  response: APIResponse,
  label: string,
  module = 'API',
): void {
  const ok = response.ok();
  const icon = ok ? '✅' : '❌';
  console.log(`[${module}] ${icon} ${label} — status ${response.status()}.`);
  expect(ok, `${label} should return a 2xx status`).toBeTruthy();
}
```

Note: here the `expect` comes *after* the log because there's no async operation to retry (unlike `toBeVisible`, which has auto-retry) — the status is already a fixed value by the time this is called.

## Combining UI + API in a single test

Useful for fast data setup (create via API, verify in UI):

```typescript
test('claim created via API shows up in UI search', async ({ claimsApi, claimsSearchPage }) => {
  await claimsApi.createClaim({ claimNumber: 'CLM-000777', amount: 300 });

  await claimsSearchPage.goto();
  await claimsSearchPage.searchByClaimNumber('CLM-000777');
  await claimsSearchPage.expectClaimVisible('CLM-000777');
});
```