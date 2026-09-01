# PlaywrightFrame_TypeScript

Playwright + TypeScript test automation framework using the Page Object Model (POM), API clients, fixtures, pass/fail logging (✅/❌), and method decorators for report steps.

Current demos:

| Layer | App | Purpose |
|-------|-----|---------|
| UI (`baseUrl`) | [SauceDemo](https://www.saucedemo.com/) | UI flows |
| API (`apiBaseUrl`) | [Automation Exercise](https://automationexercise.com/) | HTTP endpoints (product catalog) |

Do not assume UI and API share the same backend. In a real project, change the URLs in `src/config/environments.ts`.

---

## Prerequisites

Before you clone or install:

1. **Node.js 20 or later** (includes `npm`). Check versions:
   ```bash
   node -v
   npm -v
   ```
2. Internet access to download npm packages and Chromium binaries.
3. Optional: VS Code / Cursor with the Playwright extension if you want the trace viewer in the editor.

Java is **not** required for the native HTML report. You only need Java if you enable **Allure** later.

---

## Setup (step by step)

Run these commands from the **repository root**.

### 1. Install Node dependencies

```bash
npm install
```

This installs what `package.json` declares:

| Package | Why |
|---------|-----|
| `@playwright/test` | Test runner, assertions, browser, and `APIRequestContext` |
| `typescript` | Compile / typecheck |
| `@types/node` | Node type definitions |
| `dotenv` | Load `.env` from `src/config/environments.ts` |

### 2. Install Playwright browsers

`npm install` does **not** download Chromium. Install browsers once per machine (and again after upgrading `@playwright/test`):

```bash
npx playwright install chromium
```

For CI or Linux system libraries:

```bash
npx playwright install --with-deps chromium
```

This framework uses the `ui-chromium` project (Desktop Chrome). You do not need Firefox or WebKit unless you add more projects.

### 3. Create the `.env` file

Copy the example and edit local values. **Do not commit `.env`** (it is gitignored).

**PowerShell (Windows):**

```powershell
Copy-Item .env.example .env
```

**bash / Git Bash / macOS / Linux:**

```bash
cp .env.example .env
```

Expected contents (same as `.env.example`):

```env
TEST_ENV=qa
TEST_USER_EMAIL=qa.user@example.com
TEST_USER_PASSWORD=changeme
USE_ALLURE=false
```

| Variable | Required | Description |
|----------|----------|-------------|
| `TEST_ENV` | Recommended | Environment: `qa` (default), `dev`, `uat`, or `demo`. Selects URLs. |
| `TEST_USER_EMAIL` | Only if a test reads `env.testUser` | Test user. |
| `TEST_USER_PASSWORD` | Only if a test reads `env.testUser` | Password. Do not hardcode it in source. |
| `USE_ALLURE` | No | Reserved. Default reporter is HTML. Leave as `false`. |

URLs do **not** belong in `.env`. They are resolved in `src/config/environments.ts` from `TEST_ENV`.

### 4. (Optional) Typecheck

```bash
npm run typecheck
```

### 5. Run the tests

```bash
npx playwright test
```

or:

```bash
npm test
```

---

## Running tests

Projects are defined in `playwright.config.ts`:

| Project | Folder | What it runs |
|---------|--------|----------------|
| `ui-chromium` | `tests/ui` | UI on Chromium |
| `api` | `tests/api` | API (no UI browser) |

`tests/example.spec.ts` at the root of `tests/` is **not** included in those projects. Ignore it or move it under `tests/ui` if you want it as a sample.

### Full suite

```bash
npx playwright test
```

### UI only or API only

```bash
npx playwright test --project=ui-chromium
npx playwright test --project=api
```

### One file or one test

```bash
npx playwright test tests/api/products/products-list.spec.ts
npx playwright test tests/ui/decorators/decorators.spec.ts
```

### By tag (`@smoke`, `@regression`)

Titles may include tags. Filter with `--grep`:

```bash
npx playwright test --grep @smoke
npx playwright test --grep @regression
```

### Headed mode (watch the browser)

```bash
npx playwright test --project=ui-chromium --headed
```

### UI Mode (test explorer, time travel, watch)

```bash
npm run test:ui
```

or:

```bash
npx playwright test --ui
```

### Debug

```bash
npx playwright test --debug
npx playwright test tests/ui/decorators/decorators.spec.ts --debug
```

### Switch environment without code changes

```bash
# PowerShell
$env:TEST_ENV="uat"; npx playwright test --project=api

# bash
TEST_ENV=uat npx playwright test --project=api
```

### Codegen (record actions; then move them into a Page Object)

```bash
npx playwright codegen https://www.saucedemo.com/
```

---

## Reports and evidence

### HTML report (always)

After a run:

```bash
npx playwright show-report
```

HTML is written to `playwright-report/` (gitignored). If the report does not open by itself, that command serves it in the browser.

**Steps** in the report come from `@logStep` on Page Objects and API clients (`src/utils/decorators.ts`).

### Screenshot, video, and trace

In `playwright.config.ts`:

- `screenshot: 'only-on-failure'`
- `video: 'retain-on-failure'`
- `trace: 'on-first-retry'` (trace on the first retry; locally `retries` is `0`, so traces show up mainly in CI)

Artifacts land in `test-results/` (gitignored). To open a trace:

```bash
npx playwright show-trace test-results/<test-folder>/trace.zip
```

### Allure (optional)

The config currently uses only `reporter: [['html']]`. Allure needs Java and the `allure-playwright` package. Do not enable it unless the team asks. `USE_ALLURE=false` in `.env` is a reminder, not a wired switch yet.

---

## Project structure

```
playwright.config.ts          # runner, UI/API projects, timeouts, reporter
tsconfig.json                 # TypeScript strict; experimentalDecorators: false
.env.example                  # template (committed)
.env                          # local secrets (not committed)

src/
  pages/base/base.page.ts     # BasePage (goto, waits, locator)
  pages/<module>/*.page.ts    # Page Objects
  api/base/base.api.ts        # BaseApiClient (apiBaseUrl)
  api/<module>/*.api.ts       # endpoint clients
  fixtures/test-fixtures.ts   # test.extend: pages, API, browser teardown
  fixtures/data/              # typed data (not hardcoded in specs)
  config/environments.ts      # TEST_ENV → baseUrl + apiBaseUrl
  utils/env.ts                # typed reads (URLs + testUser)
  utils/logger.ts             # assertVisible / assertApiOk / logApiResponse
  utils/decorators.ts         # @logStep, @retry (native decorators)

tests/
  ui/<module>/*.spec.ts
  api/<module>/*.spec.ts
```

Naming: `*.page.ts`, `*.api.ts`, `*.spec.ts`.

---

## How the code is organized

1. **Thin specs.** Import `test` and `expect` from `src/fixtures/test-fixtures.ts`, not from `@playwright/test`, so Page Objects and API clients are already injected.
2. **One business module = one folder**, mirrored under `src/pages/` or `src/api/` and `tests/ui/` or `tests/api/`.
3. **UI assertions** use `assertVisible` / `assertHidden` / `assertText` (✅/❌ logs that match the real outcome). Do not use `expect().toBeVisible()` followed by a loose `isVisible()`.
4. **API:** specs do not call `request.get` directly; they go through `*.api.ts` and `assertApiOk`.
5. **No `waitForTimeout`.** Trust Playwright auto-wait.
6. **Credentials** only in `.env` (or explicit public demo data under `fixtures/data/`).

Current timeouts: test 60s, `expect` 10s, action 15s, navigation 30s. CI: `retries: 1`, `workers: 1`. Local: `retries: 0`.

---

## Adding a new test (checklist)

1. Does the Page Object or API client exist? If not, create it extending `BasePage` or `BaseApiClient`.
2. Register it in `src/fixtures/test-fixtures.ts`.
3. Put data in `src/fixtures/data/` or `env`; do not hardcode it in the spec.
4. Place the spec under `tests/ui/<module>/` or `tests/api/<module>/`.
5. Decorate public methods with `@logStep('...')`.
6. Visibility / state checks go through `logger.ts` helpers.
7. Add a tag in the title when it applies (`@smoke`).

---

## npm scripts

| Script | Command | What it does |
|--------|---------|----------------|
| `npm test` | `playwright test` | Full suite (UI + API projects) |
| `npm run test:ui` | `playwright test --ui` | UI Mode |
| `npm run typecheck` | `tsc --noEmit` | Typecheck without emitting JS |

---

## Troubleshooting

| Symptom | What to check |
|---------|----------------|
| `Executable doesn't exist` / Chromium does not start | `npx playwright install chromium` |
| `Missing required env var: TEST_USER_*` | Create `.env` and fill email/password, or do not read `env.testUser` if the test does not need it |
| `Unknown TEST_ENV "..."` | Use only `qa`, `dev`, `uat`, or `demo` |
| `tests/example.spec.ts` never runs | It sits outside `tests/ui` and `tests/api` |
| Empty or stale report | Re-run tests, then `npx playwright show-report` |
| Decorators do not wrap steps | Keep `experimentalDecorators` as `false` (native decorators) |

---

## References

- [Playwright Test documentation](https://playwright.dev/docs/intro)
- Agent conventions for this repo: `.cursor/skills/playwright/`
