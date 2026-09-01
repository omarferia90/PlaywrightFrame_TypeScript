# Assertions with logging (user's standard)

This is the **mandatory** pattern for any visible verification in the tests. It replaces the old pattern (`expect().toBeVisible()` followed by a manual `isVisible()`), which duplicated the check and could log a result that didn't reflect what actually happened.

## Why the old pattern is no longer used

```typescript
// ❌ Don't use this pattern anymore
await expect(heading, 'Products heading should be visible').toBeVisible();
let isCond = await heading.isVisible();
let ctrlIcon = isCond ? '✅' : '❌';
console.log(`[Login] ${ctrlIcon} Products heading ...`);
```

Problem: if the `expect` fails, the test stops right there and the `console.log` never runs. If the `expect` passes, `isCond` will almost always be `true`. The "❌" branch of the log practically never fires — it gives a false sense that the log reflects both cases.

## Standard helper: `logger.ts`

```typescript
// src/utils/logger.ts
import { expect, Locator, APIResponse } from '@playwright/test';

export async function assertVisible(
  locator: Locator,
  label: string,
  module = 'Test',
): Promise<void> {
  try {
    await expect(locator, `${label} should be visible`).toBeVisible();
    console.log(`[${module}] ✅ ${label} is visible.`);
  } catch (err) {
    console.log(`[${module}] ❌ ${label} was not found.`);
    throw err; // re-throw: the test must still fail correctly
  }
}

export async function assertHidden(
  locator: Locator,
  label: string,
  module = 'Test',
): Promise<void> {
  try {
    await expect(locator, `${label} should be hidden`).toBeHidden();
    console.log(`[${module}] ✅ ${label} is hidden as expected.`);
  } catch (err) {
    console.log(`[${module}] ❌ ${label} was still visible.`);
    throw err;
  }
}

export async function assertText(
  locator: Locator,
  expected: string,
  label: string,
  module = 'Test',
): Promise<void> {
  try {
    await expect(locator, `${label} should have text "${expected}"`).toHaveText(expected);
    console.log(`[${module}] ✅ ${label} has expected text "${expected}".`);
  } catch (err) {
    console.log(`[${module}] ❌ ${label} did not have expected text "${expected}".`);
    throw err;
  }
}

export function assertApiOk(
  response: APIResponse,
  label: string,
  module = 'API',
): void {
  const ok = response.ok();
  const icon = ok ? '✅' : '❌';
  console.log(`[${module}] ${icon} ${label} — status ${response.status()}.`);
  expect(ok, `${label} should return a 2xx status`).toBeTruthy();
}

export function logApiResponse(body: unknown, label: string, module = 'API'): void {
  console.log(`[${module}] ${label}:\n${JSON.stringify(body, null, 2)}`);
}
```

## Rules

- **Single source of truth**: the `expect` decides pass/fail; the log only reflects that real outcome via `try/catch`, so it can never "lie" by showing ✅ when it actually failed (or vice versa).
- **Always re-throw the error** (`throw err`) inside the `catch` — the helper's purpose is to enrich the log, not swallow the failure.
- **`module` identifies the log's origin** (the Page Object or feature name, e.g. `'Login'` or `'ProductsApi'`), so logs from a long run are traceable.
- **Combine with steps**: the user always wants log + steps. Wrap calls to these helpers inside a method decorated with `@logStep(...)` (see [decorator.md](decorator.md)) so that, besides the console line, the assertion also shows up as a named step in the HTML report.
- Extend this file with more variants (`assertEnabled`, `assertCount`, etc.) following the same try/log/throw pattern — don't duplicate the verification logic.
- `logApiResponse` is for inspection of bodies, not a pass/fail assertion.

## Usage in a Page Object

```typescript
@logStep('Verify inventory heading is visible')
async expectLoggedIn(): Promise<void> {
  await assertVisible(
    this.page.getByText('Products'),
    'Products heading after login',
    'Login',
  );
}
```

Result: a "Verify inventory heading is visible" step in the report, and in the console a line like `[Login] ✅ Products heading after login is visible.` or its ❌ equivalent on failure — always reflecting the real outcome.
