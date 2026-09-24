---
paths:
  - "src/**/*.test.{ts,tsx}"
  - "src/test/**/*"
  - "jest.config.js"
---

# Testing rules

Applies to all Jest tests (unit + integration). Maestro E2E is a separate tool
(YAML flows in `.maestro/`, added later) with its own rule file — nothing here
applies to it.

## Principles

- Test behavior at boundaries: domain functions, repository APIs, screens via
  visible text / accessibility labels. Never internals.
- A test that breaks on a pure refactor (no behavior change) is a bad test.
- A flaky test is a bug: fix it, never rerun it.

## Rules

- Anything that uses the theme renders via `renderWithTheme(ui, { name, scheme })`
  from `src/test/` (real ThemeProvider + SafeAreaProvider). Cover every theme
  with `test.each(allThemes…)` from the same file, asserting `toHaveStyle`
  against that theme's token values — never hardcoded colors.
- **RNTL v14 API is async** — always `await render(...)`, `await fireEvent...`,
  `await userEvent...`. An un-awaited `render` fails later with
  "`render` function has not been called". (Most training-data examples show
  the old sync API; this project uses v14.)
- Repository and screen tests run against **real in-memory SQLite**
  (better-sqlite3) with the real checked-in migrations. No DB mocks, ever.
- **Mocking is closed-list:** only the integrations in `core/integrations`
  (entitlements, file-share) may be faked, using the canonical fakes in
  `src/test/fakes.ts`. Never `jest.mock()` internal modules; never deep-mock
  third-party APIs. Needing a new mock means proposing a new integration first.
  - The closed list covers mocks we write. Mocks shipped by the jest-expo
    preset or by a library's official Jest setup (e.g. Reanimated, Skia) are
    test environment and allowed — wire them once in the Jest config and its
    setup files, never per test.
- Assert on state and visible outcomes, not mock interactions. Sole exception:
  where the call *is* the outcome (e.g. share-sheet invocation).
- Test data comes from `src/test/` factories (deterministic defaults +
  overrides, typed off the Drizzle schema via `$inferInsert`) and scenario
  builders that seed through real repositories. Fixed base timestamp, fake
  timers — never `Date.now()` in tests.
- No snapshot tests. Never run with `--updateSnapshot`.
- No random test data. Sole exception: fast-check property tests in
  `core/domain` (shrinking + reported seed).
- Domain golden tests pin outputs to published RTS RPE→%1RM chart values —
  if a refactor changes those outputs, the refactor is wrong, not the test.

## Placement

- Colocate: `foo.test.ts` next to `foo.ts`. Shared infra (factories, scenario
  builders, fakes) lives in `src/test/`.
- Never put `*.test.*` under `src/app/` — expo-router registers every file
  there as a route. Route files are thin; their screens live in
  `src/features/*` and are tested there.
- Temporary exception: `src/test/smoke.test.tsx` renders the placeholder route
  directly because no feature screen exists yet. Delete it once the first
  feature screen has its own test; don't copy its pattern.
