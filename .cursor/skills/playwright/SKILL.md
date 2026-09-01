---
name: playwright-test-framework
description: Generates and structures a Playwright test automation framework in TypeScript following the Page Object Model (POM). Use this whenever the user asks to create Playwright tests, automate a UI or API flow, build or scale an automation framework, create Page Objects, configure reporting (native HTML or Allure), or asks for tests with error handling, retries, evidence (screenshots/video/trace) and step-based logging. Also trigger on mentions of "test automation", "Playwright", "POM", "page object", "test framework", "automate flow/test case", even if the user doesn't explicitly name the skill.
---

# Playwright Test Automation Framework (TypeScript + POM)

Generates UI and API tests with Playwright Test, in TypeScript, following the Page Object Model, from a flow or requirement described by the user. The framework is scalable: every new test must fit the same structure, base class, data handling, logging and retries — never reinvent the pattern per test.

**This repo wins over generic Playwright skills.** There is no Modules layer. Pages own locators, actions, and `assert*` helpers. Specs import `test`/`expect` from `src/fixtures/test-fixtures.ts`. Demo apps may differ by layer (UI vs API); copy nearby files, do not revive a domain-specific module that is not in the tree.

## When to use this skill

- The user asks to generate one or more Playwright tests (UI or API) from a flow/requirement.
- The user asks to create or extend a Page Object.
- The user asks to scaffold the initial framework structure (folders, config, base class).
- The user asks to add reporting, error/retry handling, or prepare the framework for CI/CD.

Don't use this skill for trivial one-line tasks that don't require structure (e.g. "fix this selector"); in that case just edit the code directly.

## Workflow

### 1. Understand the requirement

Before generating code, identify:
- **What's being tested**: a UI flow, an API endpoint, or both.
- **Page(s)/module(s) involved**: does a Page Object already exist for it, or does it need to be created?
- **Required data**: does it come from fixtures, environment variables, or does it need to be generated?
- **Test type**: smoke, regression, or other — this determines which module/feature folder it lives in.

If the user's project already has a structure (pages, fixtures, config), **detect it first** (check `playwright.config.ts`, `src/pages/`, `tests/`, `src/fixtures/`) and follow the existing conventions instead of imposing this skill's own. If the project is empty or new, use the standard in [project-structure.md](project-structure.md).

### 2. Project structure

See [project-structure.md](project-structure.md) for the full folder tree (module/feature organization, separation of pages/tests/fixtures/utils/config).

### 3. Page Objects with a base class

Every page extends a shared `BasePage` (navigation, common waits, shared helpers). See [page-object-base.md](page-object-base.md) for the full pattern and a concrete Page Object example.

### 4. Assertions with logging + steps

**User's mandatory standard**: every visible assertion must produce a log with an icon (✅/❌) reflecting the actual result (never a duplicated or potentially misleading log), wrapped in `test.step` so it shows up in the report. See [assertions-logging.md](assertions-logging.md) for the `assertVisible` helper (and variants) and how to integrate it with step decorators.

Don't propose the old pattern of `expect(...).toBeVisible()` followed by a loose manual `isVisible()` — that pattern is deprecated because it duplicates the check and the log may not reflect the real outcome.

### 5. Decorators

Use TypeScript decorators to wrap steps, retries, and logging declaratively instead of repeating boilerplate in every Page Object or test method. See [decorator.md](decorator.md).

### 6. Data handling and environment variables

Test data and per-environment configuration (URLs, users, credentials) are decoupled from test code. See [environment-config.md](environment-config.md).

### 7. API tests

When the requirement involves an API, use Playwright's native `request` context, with its own "objects" layer (equivalent to Page Objects but for endpoints). See [api-testing.md](api-testing.md).

### 8. Error handling and retries

Combine: Playwright's native retries (`retries` in config), Playwright's auto-wait, failure evidence capture (screenshot/video/trace), and the custom logging helper from step 4. See [error-handling.md](error-handling.md).

### 9. Reporting

Native HTML reporter is the default (no extra dependencies). Allure is optional and requires Java — warn the user if their company restricts Java before proposing it as the only reporter. See [reporting.md](reporting.md).

### 10. Prepare for CI/CD (even if not used yet)

Even if the user doesn't have a pipeline yet, config and structure should be ready to run in CI without major changes (environment variables for URLs/credentials, adjustable `workers`/`retries`, exportable report artifacts). See [ci-cd.md](ci-cd.md) for a reference workflow example (don't generate it unless the user explicitly asks for it).

## Generating a new test: quick checklist

1. Does the needed Page Object already exist? If not, create it extending `BasePage` (step 3).
2. Does the test need data? Pull it from fixtures/environment config, don't hardcode it (step 6).
3. Write the test using `test.step` for each relevant action/verification (or rely on `@logStep` on page/API methods).
4. Every visibility/state assertion uses the logging helper (step 4), never a bare `expect` without a step or log.
5. Place the file in the corresponding module/feature folder (step 2).
6. If it's an API test, use the API objects layer, don't call `request` directly inside the test (step 7).
7. Register new Page Objects / API clients in `src/fixtures/test-fixtures.ts`.
8. Make sure the test doesn't rely on fixed sleeps — trust Playwright's auto-wait.

## Style notes

- Strict TypeScript (`strict: true` in `tsconfig.json`).
- File naming: `*.page.ts` for Page Objects, `*.spec.ts` for tests, `*.api.ts` for API layers.
- Every Page Object and test module should be readable without opening other files: descriptive names, don't over-abbreviate.
- One folder per business module, replicated under `src/pages/`, `src/api/` (if needed), and `tests/ui/` or `tests/api/`.
