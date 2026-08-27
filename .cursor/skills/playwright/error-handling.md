# Error Handling and Retries

Combine four layers, from most general to most specific:

## 1. Playwright's auto-wait

No configuration needed: `expect(locator).toBeVisible()`, `.click()`, etc. already wait automatically for the element to be ready (within the configured timeout). **Don't add fixed `waitForTimeout` calls** — if an element is slow, the fix is a better `expect`/selector, not a sleep.

## 2. Test-level retries (global config)

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  retries: process.env.CI ? 2 : 0, // more aggressive in CI, 0 locally so real flakiness isn't hidden during development
  timeout: 30_000,
  expect: { timeout: 10_000 },
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
```

- **`retries: 0` locally**: during development, a failing test should fail on the first try so real flakiness isn't hidden while writing tests.
- **`retries: 2` in CI**: tolerates infrastructure flakiness (network, containers) without blocking the pipeline for failures unrelated to the code under test.

## 3. `@retry` at the method level (targeted)

For a specific action known to be unstable, not the whole test. See `decorators.md`.

## 4. Failure evidence: screenshot, video, trace

Already configured above with `screenshot: 'only-on-failure'`, `video: 'retain-on-failure'`, `trace: 'retain-on-failure'`. This:
- Saves screenshot and video **only** on failure (doesn't fill up disk with evidence from passing tests).
- Saves the trace (an interactive timeline with DOM, network, console) so failures can be inspected with `npx playwright show-trace`.

## 5. Custom logging at the point of failure

The `assertVisible`/`assertApiOk` helpers (see `assertions-logging.md` and `api-testing.md`) already log with ❌ and re-throw the error — so the console log, the report step, and the visual evidence (screenshot/trace) all point to the same failure moment, without needing to manually correlate them.

## Attaching a targeted screenshot inside the helper (optional)

If, in addition to Playwright's automatic capture, you also want a screenshot with a name tied to the specific failed assertion:

```typescript
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
    await locator.page().screenshot({
      path: `reports/failures/${module}-${Date.now()}.png`,
    });
    throw err;
  }
}
```

Use sparingly: if `screenshot: 'only-on-failure'` is already in the global config, this is redundant unless you specifically want a searchable, module-scoped filename.