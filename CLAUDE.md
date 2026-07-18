# GymLogs

Local-first workout logger for Android (Expo/React Native, TypeScript strict).
RPE-based training analytics. No backend, no login, no tracking — all data on-device.
Full rationale for every stack/architecture decision: see `tech-stack.md`.

> Status: pre-scaffold. Commands and structure below describe the target state and
> apply as soon as the scaffold lands; update this file if they drift.

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

## Testing conventions

- Test behavior at boundaries (domain functions, repository APIs, screens via
  visible text/accessibility labels) — never internals.
- Repository/screen tests run against **real in-memory SQLite** (better-sqlite3)
  with the real migrations. No DB mocks.
- Test data comes from `src/test/` factories (deterministic defaults + overrides,
  typed off the Drizzle schema) and scenario builders that seed through real
  repositories. Fixed base timestamp, fake timers — never `Date.now()` in tests.
- **Mocking is closed-list:** only app-owned ports (entitlements, file-share) may
  be faked, using the canonical fakes in `src/test/fakes.ts`. Needing a new mock
  means proposing a new port first. Never `jest.mock()` internal modules; never
  deep-mock third-party APIs.
- Assert on state/visible outcomes, not on mock interactions (exception: where the
  call is the outcome, e.g. share-sheet invocation).
- No snapshot tests. Never run with `--updateSnapshot`.
- No random test data except fast-check property tests in `core/domain`.
- A flaky test is a bug: fix it, don't rerun it.
- Domain golden tests pin outputs to published RTS RPE→%1RM chart values — if a
  refactor changes those outputs, the refactor is wrong, not the test.

## Product invariants

- All logging and analytics features are free, forever. The Supporter IAP unlocks
  cosmetics only (themes, icons, extra export formats).
- Local-first is permanent: no feature may require an account, a network call, or
  send user data off-device. CSV export must always exist.
