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

## Concrete Page Object (UI demo: login)

Use the app that `baseUrl` points to (SauceDemo in this framework). Prefer role/placeholder locators when the app has no `data-testid`.

```typescript
// src/pages/auth/login.page.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { assertVisible } from '../../utils/logger';
import { logStep } from '../../utils/decorators';

export class LoginPage extends BasePage {
  readonly url = '/';

  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = this.page.getByPlaceholder('Username');
    this.passwordInput = this.page.getByPlaceholder('Password');
    this.loginButton = this.page.getByRole('button', { name: 'Login' });
  }

  @logStep('Log in with credentials')
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  @logStep('Verify inventory heading is visible')
  async expectLoggedIn(): Promise<void> {
    await assertVisible(
      this.page.getByText('Products'),
      'Products heading after login',
      'Login',
    );
  }
}
```

## Conventions

- Playwright's `Page` lives as a `protected` property on `BasePage`; tests never touch it directly, they only call Page Object methods.
- Locators are declared once in the constructor (or as private getters if they depend on a parameter), never inline inside each method except when the locator is a one-off assertion on a unique heading/text.
- Selector strategy: `getByRole` / `getByLabel` / `getByPlaceholder` first; `data-testid`/`data-test` when the app exposes them; CSS/`locator()` next; XPath last.
- Every public action or verification method relevant to a step is decorated with `@logStep(...)` (see [decorator.md](decorator.md)) so it automatically shows up in the report without manually wrapping each test line in `test.step`.
- A Page Object **does not** perform business `expect` calls directly except through the `assertVisible`/equivalent helper (see [assertions-logging.md](assertions-logging.md)) — this keeps logging centralized and consistent.
- Register the page in `src/fixtures/test-fixtures.ts` so specs receive it as a fixture instead of calling `new LoginPage(page)`.
