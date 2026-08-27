# Assertions with logging (user's standard)

This is the **mandatory** pattern for any visible verification in the tests. It replaces the old pattern (`expect().toBeVisible()` followed by a manual `isVisible()`), which duplicated the check and could log a result that didn't reflect what actually happened.

## Why the old pattern is no longer used

```typescript
// ❌ Don't use this pattern anymore
await expect(claimRow, `Claim row with number ${claimNumber} should be visible`).toBeVisible();
let isCond = await claimRow.isVisible();
let ctrlIcon = isCond ? '✅' : '❌';
console.log(`[Search] ${ctrlIcon} Claim row for "${claimNumber}" ...`);
```

Problem: if the `expect` fails, the test stops right there and the `console.log` never runs. If the `expect` passes, `isCond` will almost always be `true`. The "❌" branch of the log practically never fires — it gives a false sense that the log reflects both cases.

## Standard helper: `logger.ts`

```typescript
// src/utils/logger.ts
import { expect, Locator } from '@playwright/test';

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
```

## Rules

- **Single source of truth**: the `expect` decides pass/fail; the log only reflects that real outcome via `try/catch`, so it can never "lie" by showing ✅ when it actually failed (or vice versa).
- **Always re-throw the error** (`throw err`) inside the `catch` — the helper's purpose is to enrich the log, not swallow the failure.
- **`module` identifies the log's origin** (the Page Object or feature name, e.g. `'ClaimsSearch'`), so logs from a long run are traceable.
- **Combine with steps**: the user always wants log + steps. Wrap calls to these helpers inside a method decorated with `@logStep(...)` (see `decorators.md`) so that, besides the console line, the assertion also shows up as a named step in the HTML/Allure report.
- Extend this file with more variants (`assertEnabled`, `assertCount`, etc.) following the same try/log/throw pattern — don't duplicate the verification logic.

## Usage in a Page Object

```typescript
@logStep('Verify claim row is visible')
async expectClaimVisible(claimNumber: string): Promise<void> {
  await assertVisible(
    this.claimRow(claimNumber),
    `Claim row with number ${claimNumber}`,
    'ClaimsSearch',
  );
}
```

Result: a "Verify claim row is visible" step in the report, and in the console a line like `[ClaimsSearch] ✅ Claim row with number 12345 is visible.` or its ❌ equivalent on failure — always reflecting the real outcome.