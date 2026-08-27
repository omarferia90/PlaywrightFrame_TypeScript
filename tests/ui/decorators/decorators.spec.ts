import { type Page } from '@playwright/test';
import { test, expect } from '../../../src/fixtures/test-fixtures';
import { logStep, retry } from '../../../src/utils/decorators';

class DecoratorDemoPage {
  constructor(private readonly page: Page) {}

  @logStep('Fill search')
  async fillSearch(value: string): Promise<void> {
    await this.page.getByTestId('q').fill(value);
  }

  @logStep('Read search value')
  async getSearchValue(): Promise<string> {
    return this.page.getByTestId('q').inputValue();
  }

  @logStep('Throw on purpose')
  async failLoudly(): Promise<never> {
    throw new Error('decorator-should-surface-this');
  }

  private attempts = 0;

  @retry(3, 10)
  async succeedAfterTwoFailures(): Promise<number> {
    this.attempts += 1;
    if (this.attempts < 3) throw new Error(`fail-${this.attempts}`);
    return this.attempts;
  }

  @retry(2, 10)
  async alwaysFail(): Promise<never> {
    throw new Error('always-fail');
  }
}

test.describe('Decorator runtime', () => {
  test.beforeEach(async ({ page }) => {
    await page.setContent('<input data-testid="q" />');
  });

  test('logStep keeps this bound and returns the method result', async ({ page }) => {
    const demo = new DecoratorDemoPage(page);
    await demo.fillSearch('CLM-1');
    expect(await demo.getSearchValue()).toBe('CLM-1');
  });

  test('logStep surfaces errors from the wrapped method', async ({ page }) => {
    const demo = new DecoratorDemoPage(page);
    await expect(demo.failLoudly()).rejects.toThrow('decorator-should-surface-this');
  });

  test('retry recovers after transient failures', async ({ page }) => {
    const demo = new DecoratorDemoPage(page);
    await expect(demo.succeedAfterTwoFailures()).resolves.toBe(3);
  });

  test('retry rethrows after exhausting attempts', async ({ page }) => {
    const demo = new DecoratorDemoPage(page);
    await expect(demo.alwaysFail()).rejects.toThrow('always-fail');
  });
});
