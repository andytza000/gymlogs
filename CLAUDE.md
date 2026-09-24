# GymLogs

Local-first workout logger for Android (Expo/React Native, TypeScript strict).
RPE-based training analytics. No backend, no login, no tracking — all data on-device.
Full rationale for every stack/architecture decision: see `tech-stack.md`.

> Status: scaffold + Jest harness landed. Still pending from Step 0: Prettier
> (lint currently = ESLint only), ESLint boundary rules, CI workflow.

## Commands

- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` — ESLint (Prettier check planned — see Status)
- `npm test` — Jest (unit + integration; headless, no emulator)

All three must be green before any commit. CI will enforce the same set on PRs
(planned — no CI yet, so running them locally is the only gate).
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
  (ESLint boundary rules planned — until they land, check imports by hand;
  once added, do not weaken them.)
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

- Test rules live in `.claude/rules/testing.md`. They load automatically when an
  existing test is read, but not when a new test file is created, so read that
  file before writing a new test.
- Design-time invariant: only app-owned ports may be mocked — needing a new mock
  means proposing a new port first. Design features accordingly.

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
