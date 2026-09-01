# Preparing for CI/CD

The user doesn't have a pipeline yet, so **don't generate a CI workflow unless explicitly asked**. This reference exists so the framework's config is ready for CI without major refactors once the time comes.

## What should be ready from day 1

- **Secrets via environment variable**: `TEST_USER_EMAIL`, `TEST_USER_PASSWORD`, `TEST_ENV`. URLs live in `src/config/environments.ts`; do not hardcode credentials in Page Objects (see [environment-config.md](environment-config.md)).
- **`retries` conditioned on `process.env.CI`**: see [error-handling.md](error-handling.md) — already handled in `playwright.config.ts`.
- **Reports exportable as artifacts**: default HTML output is `playwright-report/` (gitignored).
- **Adjustable `workers`**: this repo uses `workers: process.env.CI ? 1 : undefined`.

```typescript
// playwright.config.ts
export default defineConfig({
  workers: process.env.CI ? 1 : undefined,
});
```

Projects already split UI vs API (`ui-chromium` / `api`). CI can run all projects or a subset with `--project`.

## Reference example (do NOT generate unless explicitly requested)

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    env:
      CI: true
      TEST_ENV: qa
      TEST_USER_EMAIL: ${{ secrets.TEST_USER_EMAIL }}
      TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report
          retention-days: 14
```

Notes if the user asks to enable this later:
- If they use Allure in CI, add a `npx allure generate` step **only if the runner has Java** (setup-java action) — otherwise only upload results as an artifact.
- Adjust `retention-days` and the trigger (`on:`) to the team's actual policies, don't assume.
