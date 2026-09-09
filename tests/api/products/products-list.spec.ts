import { test, expect } from '../../../src/fixtures/test-fixtures';
import { validation } from '../../../src/utils/assertions';
import type { ProductsListResponse } from '../../../src/api/products/products.api';

test.describe('Products - API', () => {
  test('returns the product catalog @smoke', async ({ productsApi }) => {
    const response = await productsApi.getProductsList();
    await validation.api.assertApiOk(response, 'Get products list', 'ProductsApi');

    const body = (await response.json()) as ProductsListResponse;
    await validation.api.logApiResponse(body, 'Get products list body', 'ProductsApi');

    expect(body.responseCode, 'API responseCode should be 200').toBe(200);
    expect(body.products.length, 'Catalog should include at least one product').toBeGreaterThan(0);

    const first = body.products[0];
    expect(first.id, 'Product should have an id').toBeGreaterThan(0);
    expect(first.name, 'Product should have a name').toBeTruthy();
  });
});
