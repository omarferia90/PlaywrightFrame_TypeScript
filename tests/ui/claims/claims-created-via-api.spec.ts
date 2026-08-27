import { test } from '../../../src/fixtures/test-fixtures';

test.describe('Claims - mixed API setup + UI verification', () => {
  test('claim created via API shows up in UI search', async ({ claimsApi, claimsSearchPage }) => {
    // Fast setup via API instead of creating the claim through the UI
    await claimsApi.createClaim({ claimNumber: 'CLM-000777', amount: 300 });

    // Verify the outcome through the actual UI flow the user cares about
    await claimsSearchPage.goto();
    await claimsSearchPage.searchByClaimNumber('CLM-000777');
    await claimsSearchPage.expectClaimVisible('CLM-000777');
  });
});
