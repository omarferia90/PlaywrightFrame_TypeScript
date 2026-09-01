# API Tests

Use Playwright's native `request` context, wrapped in an "API objects" layer equivalent to Page Objects — this way API tests have the same structure and readability as UI tests, and never call `request.get(...)` directly inside the `.spec.ts` file.

`BaseApiClient.baseUrl` is `env.apiBaseUrl`, which may be a **different origin** from the UI `baseUrl`.

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

## Concrete API client (demo: product catalog)

```typescript
// src/api/products/products.api.ts
import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApiClient } from '../base/base.api';
import { logStep } from '../../utils/decorators';

export interface ProductCategory {
  usertype: { usertype: string };
  category: string;
}

export interface Product {
  id: number;
  name: string;
  price: string;
  brand: string;
  category: ProductCategory;
}

export interface ProductsListResponse {
  responseCode: number;
  products: Product[];
}

export class ProductsApi extends BaseApiClient {
  constructor(request: APIRequestContext) {
    super(request);
  }

  @logStep('Get all products via API')
  async getProductsList(): Promise<APIResponse> {
    const origin = this.baseUrl.replace(/\/$/, '');
    return this.request.get(`${origin}/api/productsList`);
  }
}
```

Strip a trailing slash on `baseUrl` before concatenating paths so `https://host/` + `/api/...` does not produce a double slash.

## API test

```typescript
// tests/api/products/products-list.spec.ts
import { test, expect } from '../../../src/fixtures/test-fixtures';
import { assertApiOk, logApiResponse } from '../../../src/utils/logger';
import type { ProductsListResponse } from '../../../src/api/products/products.api';

test.describe('Products - API', () => {
  test('returns the product catalog @smoke', async ({ productsApi }) => {
    const response = await productsApi.getProductsList();
    assertApiOk(response, 'Get products list', 'ProductsApi');

    const body = (await response.json()) as ProductsListResponse;
    logApiResponse(body, 'Get products list body', 'ProductsApi');

    expect(body.responseCode, 'API responseCode should be 200').toBe(200);
    expect(body.products.length, 'Catalog should include at least one product').toBeGreaterThan(0);
  });
});
```

## Assertions for API responses

Use `assertApiOk` from `src/utils/logger.ts` (see [assertions-logging.md](assertions-logging.md)). Status is already a fixed value when the helper runs, so the log can happen before `expect` — unlike `toBeVisible`, which auto-retries.

Some public APIs return HTTP 200 with a payload `responseCode`. Assert **both** when the contract requires it.

## Combining UI + API in a single test

Useful for fast data setup (create via API, verify in UI) **when both layers talk to the same product**. In this demo framework they do not (SauceDemo vs Automation Exercise), so do not invent a mixed test that pretends they share data. When a real project shares a backend:

```typescript
test('item created via API shows up after login', async ({ productsApi, loginPage }) => {
  await productsApi.getProductsList();

  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');
  await loginPage.expectLoggedIn();
});
```

Only write that shape when the URLs and domain actually connect.
