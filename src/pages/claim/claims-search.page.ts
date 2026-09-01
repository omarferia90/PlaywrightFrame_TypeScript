import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { assertVisible } from '../../utils/logger';
import { logStep } from '../../utils/decorators';

export class ClaimsSearchPage extends BasePage {
  readonly url = '/';

  private readonly searchInput: Locator;
  private readonly searchButton: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = this.locator('[data-testid="claims-search-input"]');
    this.searchButton = this.locator('[data-testid="claims-search-button"]');
  }

  @logStep('Search claim by number')
  async searchByClaimNumber(claimNumber: string): Promise<void> {
    await this.searchInput.fill(claimNumber);
    await this.searchButton.click();
  }

  private claimRow(claimNumber: string): Locator {
    return this.locator(`[data-testid="claim-row-${claimNumber}"]`);
  }

  @logStep('Verify claim row is visible')
  async expectClaimVisible(claimNumber: string): Promise<void> {
    await assertVisible(
      this.claimRow(claimNumber),
      `Claim row with number ${claimNumber}`,
      'ClaimsSearch',
    );
  }
}
