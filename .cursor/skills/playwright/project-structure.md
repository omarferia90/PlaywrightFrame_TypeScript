# Project Structure (proposed standard)

Organized by module/feature, so it scales without turning into a flat folder with hundreds of files. Examples in this framework are **generic demo apps** (SauceDemo UI, Automation Exercise API), not a client-specific domain.

```
project-root/
├── playwright.config.ts
├── tsconfig.json
├── .env.example
├── .env                        # not versioned
├── package.json
│
├── src/
│   ├── pages/
│   │   ├── base/
│   │   │   └── base.page.ts    # BasePage: navigation, waits, shared helpers
│   │   ├── auth/
│   │   │   └── login.page.ts   # SauceDemo (or whatever UI app baseUrl points to)
│   │   └── ...                 # one folder per business module
│   │
│   ├── api/
│   │   ├── base/
│   │   │   └── base.api.ts     # BaseApiClient: request context, headers, base URL
│   │   ├── products/
│   │   │   └── products.api.ts # Automation Exercise (or whatever apiBaseUrl points to)
│   │   └── ...
│   │
│   ├── fixtures/
│   │   ├── test-fixtures.ts    # extends Playwright's `test` with injected page objects/api clients
│   │   └── data/
│   │       ├── users.data.ts   # typed test data (not hardcoded in the test)
│   │       └── products.data.ts
│   │
│   ├── utils/
│   │   ├── logger.ts           # logging helper with icons (see assertions-logging.md)
│   │   ├── decorators.ts       # step/retry decorators (see decorator.md)
│   │   └── env.ts              # typed env reading; URLs come from activeEnvironment
│   │
│   └── config/
│       └── environments.ts     # URLs per TEST_ENV; UI and API may be different apps
│
├── tests/
│   ├── ui/
│   │   ├── auth/
│   │   │   └── login.spec.ts
│   │   └── decorators/
│   │       └── decorators.spec.ts   # decorator runtime checks (no product domain)
│   └── api/
│       └── products/
│           └── products-list.spec.ts
│
└── playwright-report/          # native HTML reporter output (gitignored)
```

## Organization rules

- **One business module = one folder**, replicated across `pages/`, `api/` (if applicable), and `tests/ui/` or `tests/api/`. Working on "auth" or "products" means knowing exactly where to look.
- **UI and API may target different apps.** `activeEnvironment.baseUrl` is the UI origin; `activeEnvironment.apiBaseUrl` is the API origin. Do not assume they share a host.
- **`tests/ui` and `tests/api` are kept separate**: run `npx playwright test --project=ui-chromium` or `--project=api`, matching `playwright.config.ts` projects.
- **Tags for smoke/regression**: use Playwright tags in the test title (`test('successful login @smoke', ...)`) and filter with `--grep @smoke`.
- **`fixtures/data/`** holds typed data (interfaces/types), not loose untyped JSON — so the editor flags it if a test uses a field that doesn't exist.
- If the user's project already has a different but functional structure, adapt this convention to theirs instead of forcing a full migration.
