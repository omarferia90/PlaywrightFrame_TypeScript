# Decorators

Use TypeScript method decorators to wrap repetitive behavior (report steps, retries) without duplicating boilerplate across every Page Object or API client method.

Requires in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "target": "ES2022"
  }
}
```

## `@logStep`: wraps the method in `test.step`

```typescript
// src/utils/decorators.ts
import { test } from '@playwright/test';

export function logStep(stepName?: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const name = stepName ?? `${target.constructor.name}.${propertyKey}`;
      return test.step(name, async () => {
        return originalMethod.apply(this, args);
      });
    };

    return descriptor;
  };
}
```

This makes every decorated method show up as a named step in the HTML and Allure reports, without having to manually wrap each call in the test with `await test.step('...', async () => { ... })`.

## `@retry`: custom retries at the method level

For specific cases where Playwright's global retry (at the whole-test level) is too coarse — e.g. one specific flaky action inside a test that otherwise passes fine.

```typescript
export function retry(times = 2, delayMs = 500) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      let lastError: unknown;
      for (let attempt = 1; attempt <= times; attempt++) {
        try {
          return await originalMethod.apply(this, args);
        } catch (err) {
          lastError = err;
          console.log(
            `[Retry] ⚠️ ${propertyKey} failed on attempt ${attempt}/${times}.`,
          );
          if (attempt < times) await new Promise((r) => setTimeout(r, delayMs));
        }
      }
      throw lastError;
    };

    return descriptor;
  };
}
```

Combined usage:

```typescript
@retry(3)
@logStep('Click flaky element')
async clickFlakyButton(): Promise<void> {
  await this.flakyButton.click();
}
```

## When to use decorators vs. Playwright's global retry

- **Global retry (`retries` in `playwright.config.ts`)**: first line of defense, covers general infrastructure/network flakiness. See `error-handling.md`.
- **`@retry` at the method level**: only for specific actions known to be unstable (e.g. a click on an element that sometimes takes a while to become enabled) where you don't want to retry the whole test, just that step.
- Don't overuse `@retry` to paper over bad selectors or missing waits — if something fails consistently, the problem is the selector or the wait, not a lack of retries.