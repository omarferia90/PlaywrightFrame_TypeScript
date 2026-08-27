import { Page, Locator } from '@playwright/test';
import { logStep } from '../../utils/decorators';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  abstract readonly url: string;

  @logStep('Navigate to page')
  async goto(): Promise<void> {
    await this.page.goto(this.url);
  }

  @logStep('Wait for page to be ready')
  async waitForReady(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  protected locator(selector: string): Locator {
    return this.page.locator(selector);
  }
}
