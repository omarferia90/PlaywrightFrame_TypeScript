# Reporting: Native HTML + Allure (optional)

The native HTML reporter has no external dependencies and is the **default in this repo** (`reporter: [['html']]` → `playwright-report/`). Allure requires Java, so before recommending it as the *only* reporter, ask or warn the user if their company restricts Java usage.

## `playwright.config.ts`

Current default:

```typescript
reporter: [['html']],
```

Optional richer setup (only if the user asks):

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    ...(process.env.USE_ALLURE === 'true'
      ? [['allure-playwright', { resultsDir: 'allure-results' }] as const]
      : []),
  ],
});
```

`.env.example` already has `USE_ALLURE=false`. Do not add `allure-playwright` to `package.json` unless the user opts in.

## Installing Allure (when applicable)

```bash
npm install -D allure-playwright
```

Requires the Allure CLI (Java) to generate the visual report:

```bash
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report
```

**Always include this warning when proposing Allure**: if the user's company restricts installing Java on CI/dev machines, Allure won't be able to run there — in that case, stick to the native HTML reporter.

## Viewing the native HTML report

```bash
npx playwright show-report
```

## Steps in the reports

Since Page Object/API client methods are already decorated with `@logStep` (see [decorator.md](decorator.md)), the HTML report automatically shows the step tree with readable names, with no need for manual `test.step` calls repeated in every test.
