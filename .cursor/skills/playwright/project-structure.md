# Project Structure (proposed standard)

Organized by module/feature, so it scales without turning into a flat folder with hundreds of files.

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
│   │   │   └── login.page.ts
│   │   ├── claims/
│   │   │   ├── claims-search.page.ts
│   │   │   └── claims-detail.page.ts
│   │   └── ...                 # one folder per business module
│   │
│   ├── api/
│   │   ├── base/
│   │   │   └── base.api.ts     # BaseApiClient: request context, headers, base URL
│   │   ├── claims/
│   │   │   └── claims.api.ts
│   │   └── ...
│   │
│   ├── fixtures/
│   │   ├── test-fixtures.ts    # extends Playwright's `test` with injected page objects/api clients
│   │   └── data/
│   │       ├── claims.data.ts  # typed test data (not hardcoded in the test)
│   │       └── users.data.ts
│   │
│   ├── utils/
│   │   ├── logger.ts           # logging helper with icons (see assertions-logging.md)
│   │   ├── decorators.ts       # step/retry decorators (see decorators.md)
│   │   └── env.ts              # typed environment variable reading
│   │
│   └── config/
│       ├── environments.ts     # URLs/credentials per environment (dev/qa/staging)
│       └── playwright.config.base.ts
│
├── tests/
│   ├── ui/
│   │   ├── auth/
│   │   │   └── login.spec.ts
│   │   └── claims/
│   │       ├── claims-search.spec.ts
│   │       └── claims-detail.spec.ts
│   └── api/
│       └── claims/
│           └── claims-crud.spec.ts
│
└── reports/                    # reporter output (gitignored except config)
    ├── html/
    └── allure-results/
```

## Organization rules

- **One business module = one folder**, replicated across `pages/`, `api/` (if applicable), and `tests/ui/` or `tests/api/`. This way, working on "claims" always means knowing exactly where to look.
- **`tests/ui` and `tests/api` are kept separate**: this allows running `npx playwright test tests/ui` or `tests/api` independently, and using `projects` in the config to run them with different settings (e.g. different timeouts or browsers).
- **Tags for smoke/regression**: in addition to folder separation, use Playwright tags in the test title (`test('successful login @smoke', ...)`) and filter with `--grep @smoke`. This is more flexible than folders alone when a module has tests of different priority.
- **`fixtures/data/`** holds typed data (interfaces/types), not loose untyped JSON — so the editor flags it if a test uses a field that doesn't exist.
- If the user's project already has a different but functional structure, adapt this convention to theirs instead of forcing a full migration.