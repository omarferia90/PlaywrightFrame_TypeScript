# Page Objects with a base class

## BasePage

Every page extends `BasePage`, which centralizes what's common across any Page Object: navigation, shared waits, and access to Playwright's `Page` without exposing it directly in every test method.

```typescript
// src/pages/base/base.page.ts
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
```

## Concrete Page Object

```typescript
// src/pages/claims/claims-search.page.ts
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { assertVisible } from '../../utils/logger';
import { logStep } from '../../utils/decorators';

export class ClaimsSearchPage extends BasePage {
  readonly url = '/claims/search';

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
```

## Conventions

- Playwright's `Page` lives as a `protected` property on `BasePage`; tests never touch it directly, they only call Page Object methods.
- Locators are declared once in the constructor (or as private getters if they depend on a parameter, like `claimRow(claimNumber)`), never inline inside each method.
- Default selector strategy: `data-testid`/`data-test` (proposed as the standard since it's the most stable against visual changes). If a page has no `data-testid`, use `getByRole`/`getByText` as the second choice before falling back to CSS/XPath.
- Every public action or verification method relevant to a step is decorated with `@logStep(...)` (see `decorators.md`) so it automatically shows up in the report without manually wrapping each test line in `test.step`.
- A Page Object **does not** perform business `expect` calls directly except through the `assertVisible`/equivalent helper (see `assertions-logging.md`) — this keeps logging centralized and consistent.