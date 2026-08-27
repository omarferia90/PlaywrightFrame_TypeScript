import { test } from '../../../src/fixtures/test-fixtures';
import { validClaim } from '../../../src/fixtures/data/claims.data';

test.describe('Claims search - UI', () => {
  test('finds an existing claim by number @smoke', async ({ claimsSearchPage }) => {
    await claimsSearchPage.goto();
    await claimsSearchPage.searchByClaimNumber(validClaim.claimNumber);
    await claimsSearchPage.expectClaimVisible(validClaim.claimNumber);
  });
});
