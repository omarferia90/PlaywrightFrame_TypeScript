# Preparing for CI/CD

The user doesn't have a pipeline yet, so **don't generate a CI workflow unless explicitly asked**. This reference exists so the framework's config is ready for CI without major refactors once the time comes.

## What should be ready from day 1

- **Everything configurable via environment variable**: `BASE_URL`, `API_BASE_URL`, credentials, `TEST_ENV`. No environment value hardcoded in `playwright.config.ts` or in Page Objects (see `environment-config.md`).
- **`retries` conditioned on `process.env.CI`**: see `error-handling.md` — already handled if that reference was followed.
- **Reports exportable as artifacts**: `reports/html` and `reports/allure-results` are plain folders, easy to upload as an artifact in any CI without extra steps.
- **Adjustable `workers`**: let Playwright auto-detect locally, but allow an environment-variable override if the CI runner has limited resources:

```typescript
// playwright.config.ts
export default defineConfig({
  workers: process.env.CI ? 2 : undefined,
});
```

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
      BASE_URL: ${{ secrets.BASE_URL }}
      API_BASE_URL: ${{ secrets.API_BASE_URL }}
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
          path: reports/html
          retention-days: 14
```

Notes if the user asks to enable this later:
- If they use Allure in CI, add a `npx allure generate` step **only if the runner has Java** (setup-java action) — otherwise, only upload `allure-results` as an artifact and generate the visual report outside the pipeline.
- Adjust `retention-days` and the trigger (`on:`) to the team's actual policies, don't assume.