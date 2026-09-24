# GymLogs

Local-first workout logger for Android (Expo/React Native, TypeScript strict).
RPE-based training analytics. No backend, no login, no tracking — all data on-device.

## Workflow

- The plan and all open work live in GitHub Issues (`gh issue list`); check open
  issues before choosing or planning work. A PR that finishes an issue says
  `Closes #N`; partial work says `Refs #N`; small doc/chore PRs may have no issue.
- Before adding a dependency, changing a stack/architecture decision, or explaining
  why one was made, read the matching `tech-stack.md` section. Changing a decision
  needs the user's explicit OK; then update that section in the same PR.
- Before building or proposing a feature, check v1 scope in `README.md`;
  out-of-scope items need the user's explicit OK.

## Commands

- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` — ESLint (incl. architecture boundaries) + Prettier check;
  `npm run format` fixes formatting
- `npm test` — Jest (unit + integration; headless, no emulator)

All three must be green before any commit. CI (`.github/workflows/ci.yml`) runs
them on every PR, plus `npm run bundle` (Metro Android bundle — catches bundling
errors tsc misses; run it locally when touching imports, assets, or config).
Maestro E2E runs on main/nightly only — never part of the local/PR loop.

## Structure

```
src/app/        expo-router routes only — thin, no logic
src/core/       shared kernel:
  db/             schema, migrations, repositories
  domain/         pure functions (RPE, e1RM, volume, CSV)
  design-system/  tokens, primitives, chart wrappers
  integrations/   wrappers for OS and store APIs (purchases, file share)
src/features/*  one folder per feature: screens, components, hooks, store,
                and the feature's own logic as plain modules
src/test/       factories, scenario builders, fakes
```

New feature = new folder in `src/features/`, wired into `src/app/` routes.
Files outside these folders fail lint; don't invent new top-level folders.

## Architecture rules

- Dependencies point one way: features → core. Features never import each other;
  code needed by two features graduates to core. Core never imports features.
  Only tests import `src/test`. (ESLint-enforced in `eslint.config.js` — do not
  weaken those rules.)
- **All DB access goes through `core/db` repositories.** Never query SQLite from
  features. The repository layer is where a future sync engine plugs in.
- OS and store APIs (purchases, file share) are used only through
  `core/integrations`: one app-owned interface per integration, plus one adapter
  wrapping the real library. The expo-iap adapter is the only file that touches
  the store APIs. Every integration lives there, even one only a single feature
  uses, and nothing else does. A new integration or DB library goes on
  `INTEGRATION_LIBRARIES` / `DB_LIBRARIES` in `eslint.config.js`.
- Business logic lives in the feature that uses it, or in `core/domain` as pure
  functions once shared. Data access stays in `core/db` repositories.
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

- Test rules live in `.claude/rules/testing.md`. They load automatically when an
  existing test is read, but not when a new test file is created, so read that
  file before writing a new test.
- Design-time invariant: only `core/integrations` may be mocked — needing a new
  mock means proposing a new integration first. Design features accordingly.

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
