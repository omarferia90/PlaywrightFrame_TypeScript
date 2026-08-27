import { test, expect } from '../../../src/fixtures/test-fixtures';
import { assertApiOk } from '../../../src/utils/logger';

test.describe('Claims - API', () => {
  test('creates a claim and retrieves it @smoke', async ({ claimsApi }) => {
    const createResponse = await claimsApi.createClaim({
      claimNumber: 'CLM-000999',
      amount: 1500,
    });
    assertApiOk(createResponse, 'Create claim', 'ClaimsApi');

    const getResponse = await claimsApi.getClaim('CLM-000999');
    assertApiOk(getResponse, 'Get claim', 'ClaimsApi');

    const body = await getResponse.json();
    expect(body.claimNumber).toBe('CLM-000999');
  });

  test('deletes a claim @regression', async ({ claimsApi }) => {
    await claimsApi.createClaim({ claimNumber: 'CLM-000998', amount: 200 });

    const deleteResponse = await claimsApi.deleteClaim('CLM-000998');
    assertApiOk(deleteResponse, 'Delete claim', 'ClaimsApi');

    const getResponse = await claimsApi.getClaim('CLM-000998');
    expect(getResponse.status(), 'Deleted claim should return 404').toBe(404);
  });
});
