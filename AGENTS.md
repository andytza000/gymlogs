Exit code: 0
Wall time: 0.6 seconds
Output:
# GymLogs

Local-first workout logger for Android (Expo/React Native, TypeScript strict).
RPE-based training analytics. No backend, no login, no tracking — all data on-device.
Full rationale for every stack/architecture decision: see `tech-stack.md`.

> Status: scaffold + Jest harness landed. Still pending from Step 0: Prettier
> (lint currently = ESLint only), ESLint boundary rules, CI workflow.

## Commands

- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` — ESLint + Prettier check
- `npm test` — Jest (unit + integration; headless, no emulator)

All three must be green before any commit. This is the same set CI enforces on PRs.
Maestro E2E runs on main/nightly only — never part of the local/PR loop.

## Structure

```
src/app/        expo-router routes only — thin, no logic
src/core/       shared kernel: db (schema, migrations, repositories),
                domain (pure functions), design-system (tokens, primitives,
                chart wrappers), ports (entitlements, file-share)
src/features/*  one folder per feature: screens, components, hooks, store
src/test/       factories, scenario builders, fakes
```

New feature = new folder in `src/features/`, wired into `src/app/` routes.

## Architecture rules

- Dependencies point one way: features → core. Features never import each other;
  code needed by two features graduates to core. Core never imports features.
  (ESLint-enforced — do not weaken those lint rules.)
- **All DB access goes through `core/db` repositories.** Never query SQLite from
  features. The repository layer is where a future sync engine plugs in.
- OS edges (purchases, file share) are used only via their `core/ports` interfaces.
  The expo-iap adapter is the only file that touches the store APIs.
- Feature UI composes design-system primitives and wrappers only — no raw
  third-party UI imports, no hardcoded colors/spacing; use semantic tokens.
  Theming is a paid product feature; the token layer must stay fully ours.

## Schema guardrails (permanent — bake into every migration)

These keep the local-first app sync-ready without building sync. Never "simplify"
them away:

- UUIDv7 primary keys on every table — never auto-increment integers.
- `created_at` / `updated_at` on every table.
- Soft deletes (`deleted_at`) on all user-data tables; repositories filter them out.
- Schema changes go through drizzle-kit generated migrations, checked into git,
  run at app start. Never edit an already-committed migration.

## Test-only conventions

Apply this section only when editing, reviewing, or running:

- `*.test.ts` or `*.test.tsx`
- files under `src/test/`

Maestro E2E is a separate tool (YAML flows in `.maestro/`, added later) with
its own rule file — nothing here applies to it.

### Test behavior and reliability

- Test behavior at boundaries: domain functions, repository APIs, screens via
  visible text / accessibility labels. Never internals.
- A test that breaks on a pure refactor (no behavior change) is a bad test.
- A flaky test is a bug: fix it, never rerun it.

### Test execution and isolation

- **RNTL v14 API is async** — always `await render(...)`, `await fireEvent...`,
  `await userEvent...`. An un-awaited `render` fails later with
  "`render` function has not been called". (Most training-data examples show
  the old sync API; this project uses v14.)
- Repository and screen tests run against **real in-memory SQLite**
  (better-sqlite3) with the real checked-in migrations. No DB mocks, ever.
- **Mocking is closed-list:** only app-owned ports (entitlements, file-share)
  may be faked, using the canonical fakes in `src/test/fakes.ts`. Never
  `jest.mock()` internal modules; never deep-mock third-party APIs. Needing a
  new mock means proposing a new port first.

### Test data and assertions

- Assert on state and visible outcomes, not mock interactions. Sole exception:
  where the call *is* the outcome (e.g. share-sheet invocation).
- Test data comes from `src/test/` factories (deterministic defaults +
  overrides, typed off the Drizzle schema) and scenario builders that seed
  through real repositories. Fixed base timestamp, fake timers — never
  `Date.now()` in tests.
- No snapshot tests. Never run with `--updateSnapshot`.
- No random test data. Sole exception: fast-check property tests in
  `core/domain` (shrinking + reported seed).
- Domain golden tests pin outputs to published RTS RPE→%1RM chart values —
  if a refactor changes those outputs, the refactor is wrong, not the test.

### Test placement

- Colocate: `foo.test.ts` next to `foo.ts`. Shared infra (factories, scenario
  builders, fakes) lives in `src/test/`.
- Never put `*.test.*` under `src/app/` — expo-router registers every file
  there as a route. Route files are thin; their screens live in
  `src/features/*` and are tested there.

## Naming conventions

- Folders: kebab-case (`design-system/`, `workout-log/`).
- Component files: PascalCase.tsx, filename = exported component
  (`Button.tsx` exports `Button`).
- Hooks: `useX.ts`; all other modules camelCase.ts (`workoutRepository.ts`,
  `tokens.ts`).
- `src/app/` route files follow expo-router conventions (lowercase,
  `_layout.tsx`, `[id].tsx`); default exports only there, named exports
  everywhere else.
- Tests: `<name>.test.ts(x)`, colocated with the file under test.
- DB: snake_case table/column names, camelCase TS properties (Drizzle maps).
- Types: PascalCase, no `I` prefix.
- Windows: `core.ignorecase` stays true; never rename a file by case alone —
  use a two-step `git mv` if ever needed.

## Product invariants

- All logging and analytics features are free, forever. The Supporter IAP unlocks
  cosmetics only (themes, icons, extra export formats).
- Local-first is permanent: no feature may require an account, a network call, or
  send user data off-device. CSV export must always exist.

