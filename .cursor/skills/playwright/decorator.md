# Decorators

Use TypeScript method decorators to wrap repetitive behavior (report steps, retries) without duplicating boilerplate across every Page Object or API client method.

This repo uses **native TC39 method decorators** (`experimentalDecorators: false` in `tsconfig.json`). `src/utils/decorators.ts` also accepts the legacy TypeScript decorator signature so older samples still compile.

Requires in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": false
  }
}
```

Do not set `experimentalDecorators: true` unless the user explicitly wants the legacy emit. Match the repo's `tsconfig.json`.

## `@logStep`: wraps the method in `test.step`

Implementation lives in `src/utils/decorators.ts`. Behavior:

- Native: `(originalMethod, context: ClassMethodDecoratorContext) => wrapped`
- Legacy: mutates `descriptor.value` and returns the descriptor
- The wrapped method runs inside `test.step(name, ...)` so HTML reports show a named step

```typescript
import { logStep } from '../../utils/decorators';

export class LoginPage extends BasePage {
  @logStep('Log in with credentials')
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

This makes every decorated method show up as a named step in the HTML report, without having to manually wrap each call in the test with `await test.step('...', async () => { ... })`.

## `@retry`: custom retries at the method level

For specific cases where Playwright's global retry (at the whole-test level) is too coarse — e.g. one specific flaky action inside a test that otherwise passes fine.

```typescript
import { retry } from '../../utils/decorators';

@retry(3)
@logStep('Click flaky element')
async clickFlakyButton(): Promise<void> {
  await this.flakyButton.click();
}
```

Runtime checks for both decorators live in `tests/ui/decorators/decorators.spec.ts` (in-memory page via `setContent`, not a product domain).

## When to use decorators vs. Playwright's global retry

- **Global retry (`retries` in `playwright.config.ts`)**: first line of defense, covers general infrastructure/network flakiness. See [error-handling.md](error-handling.md).
- **`@retry` at the method level**: only for specific actions known to be unstable (e.g. a click on an element that sometimes takes a while to become enabled) where you don't want to retry the whole test, just that step.
- Don't overuse `@retry` to paper over bad selectors or missing waits — if something fails consistently, the problem is the selector or the wait, not a lack of retries.

When adding or changing decorator helpers, keep **both** native and legacy wrappers in `decorators.ts` so Page Objects keep working regardless of `experimentalDecorators`.
