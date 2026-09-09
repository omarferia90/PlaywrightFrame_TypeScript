import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { assertVisible } from '../../utils/logger';
import { validation } from '../../utils/assertions';
import { logStep } from '../../utils/decorators';

export class LoginPage extends BasePage {
  readonly url = '/';
  readonly pageName = 'Login';

  private get usernameInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Username' });
  }

  private get passwordInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Password' });
  }

  private get loginButton(): Locator {
    return this.page.getByRole('button', { name: 'Login' });
  }

  private get inventoryWidget(): Locator {
    return this.page.locator('.inventory_container');
  }

  private headerError(message: string): Locator {
    return this.page.getByRole('heading', { name: message});
  }

  constructor(page: Page) {
    super(page);
  }

  @logStep('Navigate to login page')
  async navigateToLoginPage(): Promise<void> {
    await this.page.goto(this.url);
    await this.waitForReady();
  }

  @logStep('Fill username')
  async fillUsername(username: string): Promise<void> {
    await validation.ui.assertVisible(this.usernameInput, `Username Field`, 'Login');
    await this.usernameInput.fill(username);
  }

  @logStep('Fill password')
  async fillPassword(password: string): Promise<void> {
    await assertVisible(this.passwordInput, `Password Field`, 'Login',);
    await this.passwordInput.fill(password);
  }

  @logStep('Click login button')
  async clickLoginButton(): Promise<void> {
    await assertVisible(this.loginButton, `Login Button`, 'Login',);
    await this.loginButton.click();
  }

  @logStep('Verify login successful')
  async verifyLoginSuccessful(): Promise<void> {
    await assertVisible(this.inventoryWidget, `Inventory Widget`, 'Login',);
  }

  @logStep('Verify error message')
  async verifyErrorMessage(errorMessage: string): Promise<void> {
    await assertVisible(this.headerError(errorMessage), `Error: `, 'Login',);
  }

  @logStep('Login with username and password')
  async login(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLoginButton();
    await this.waitForReady();
  }


}
