# Reporting: Native HTML + Allure (optional)

Configure both reporters by default. The native HTML reporter has no external dependencies and always works; Allure requires Java, so before recommending it as the *only* reporter, ask or warn the user if their company restricts Java usage.

## `playwright.config.ts`

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['list'], // readable console output while it runs
    ...(process.env.USE_ALLURE === 'true'
      ? [['allure-playwright', { resultsDir: 'reports/allure-results' }] as const]
      : []),
  ],
});
```

With this:
- The native HTML report (`reports/html`) is **always** generated — it's the guaranteed fallback.
- Allure only activates if `USE_ALLURE=true`, so the team can opt in per run (or per environment/CI) without touching code.

## Installing Allure (when applicable)

```bash
npm install -D allure-playwright
```

Requires the Allure CLI (Java) to generate the visual report from `allure-results`:

```bash
# generate and open the report (requires Java + allure-commandline)
npx allure generate reports/allure-results --clean -o reports/allure-report
npx allure open reports/allure-report
```

**Always include this warning when proposing Allure**: if the user's company restricts installing Java on CI/dev machines, Allure won't be able to run there — in that case, stick to the native HTML reporter (which never requires Java) or generate `allure-results` in CI and render the visual report in a different environment that does have Java available.

## Viewing the native HTML report

```bash
npx playwright show-report reports/html
```

## Steps in the reports

Since Page Object/API client methods are already decorated with `@logStep` (see `decorators.md`), both reports (HTML and Allure) automatically show the step tree with readable names, with no need for manual `test.step` calls repeated in every test.