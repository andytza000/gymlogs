# GymLogs — Tech Stack & Architecture Decisions

Decision record for the v1 stack. Each choice lists the decision, the reasoning, the
alternatives that were seriously considered, and any watch-outs. Reviewed July 2026.

Cross-cutting selection criteria used throughout: fit for a local-first CRUD + charts app,
AI-assisted development (headless verifiability, training-data familiarity), long-term
stewardship of each dependency, and keeping the future sync/social door open without
building any of it now.

---

## 1. App framework: React Native + Expo (dev client)

**Decision.** React Native (New Architecture) via Expo with a custom dev client.
TypeScript strict everywhere.

**Why.**
- Best AI-assisted development stack available: TypeScript/React dominate training data,
  and the whole verify loop (`tsc`, ESLint, Jest) runs headlessly without an emulator.
- Real native views — platform look and feel is inherited, including future OS restyles.
- The app is CRUD + charts; RN's historic weaknesses (heavy compute, bridge overhead)
  are gone with the New Architecture (JSI/Fabric/Hermes) and irrelevant to this workload.
- iOS later is essentially free from the same codebase (README long-term positioning).
- Multi-company governance (Meta, Expo, Microsoft, Shopify) — no single-vendor risk.
- Expo specifically: officially recommended RN framework, best docs in the ecosystem,
  Continuous Native Generation keeps native projects out of source control and out of
  the AI's edit surface, one-command SDK upgrades (solo-maintainer friendly).

**Alternatives considered.**
- *Kotlin + Jetpack Compose*: best raw performance and day-one APIs, but Android-only
  forever, slow build-based verify loop, and no reason at our app class.
- *Flutter*: excellent tooling, but Dart's thin AI training data, single-vendor (Google)
  stewardship concerns post-2024 layoffs (Flock fork), and no advantage for this app.
- *Ionic/Capacitor, .NET MAUI, PWA*: disqualified (webview feel; niche; no Play Billing
  and evictable storage respectively).

**Watch-outs.** EAS is a paid cloud from a VC-backed company — but the free tier
(15 builds/platform/month) far exceeds our needs and local builds
(`npx expo run:android`) remain a zero-cost fallback. Lock-in is low.

## 2. Navigation: expo-router

File-based routing on top of React Navigation internals (which Expo now maintains as
its own fork). Default for new Expo apps, best-documented path, screens-as-files maps
cleanly onto the feature-slice structure. React Navigation directly would buy nothing.

## 3. Language & tooling: TypeScript strict, ESLint, Prettier

Strict mode is non-negotiable: the typechecker is the first and cheapest rung of the
verification ladder (see §8). ESLint additionally enforces the architecture's import
boundaries (see §9) so structural rules are machine-checked, not prose.

## 4. Data layer: SQLite (expo-sqlite) + Drizzle ORM

**Decision.** On-device SQLite via `expo-sqlite`, accessed exclusively through a
repository layer, with Drizzle ORM for typed schema/queries and drizzle-kit for
generated, checked-in SQL migrations (bundled, run at app start via `useMigrations`).

**Why.**
- Relational, local-first, on-device is exactly SQLite's home turf; it is also the
  substrate every future sync engine (PowerSync, ElectricSQL, Turso) builds on.
- Drizzle: typed queries are verified by `tsc` (data-layer bugs caught at compile
  time); schema-diffed migrations make the sync guardrails enforceable in code;
  the same schema definitions port to a server DB if a backend ever exists.
- SQL is the best-represented database language in AI training data.

**Sync-ready guardrails** (the rule list: CLAUDE.md "Schema guardrails"). UUIDv7 keys,
timestamps and soft deletes are what a typical sync design needs to merge several
devices' data: IDs created on different devices don't collide (two auto-increment
counters would both start at 1), `updated_at` finds what changed since the last sync
and settles last-write-wins conflicts, and a soft-deleted row stays behind so other
devices learn it was deleted. Cheap in the first migration, a painful data migration
to retrofit. The repository layer is the only
DB access path, so a future sync engine slots in behind it without touching features.

**Alternatives considered.** WatermelonDB (great for 10k+-row reactive lists and
built-in sync, but locks us into its model layer — our repository seam already
reserves that seat); Realm (MongoDB ended active development 2024 — avoided on
stewardship); raw SQL (no compile-time safety); Kysely (no migration generator);
Prisma (server-first architecture, heavy on mobile); op-sqlite as driver (faster at
bulk scale we'll never reach — Drizzle supports it, so it stays a cheap swap if ever
needed).

**Watch-outs.** Drizzle is the youngest core dependency (2022). Contained: it is a
thin layer over SQL (any query can drop to raw SQL) and the repository layer means
even full replacement touches one directory.

## 5. Client state: Zustand

**Decision.** Zustand for ephemeral state only. SQLite is the single source of truth;
Zustand holds the in-progress workout session, rest timer, and UI preferences.
The active session uses the `persist` middleware (react-native-mmkv storage) so an
in-progress workout survives Android killing the app between sets.

**Why.** ~1KB, no boilerplate, selector-based re-renders (timer ticks don't re-render
the logging screen), stores are plain TS testable in Jest without rendering React,
top-tier AI familiarity. Our architecture makes this a deliberately small decision.

**Alternatives considered.** Redux Toolkit (enterprise machinery without a problem to
solve here), Jotai (equally defensible, no advantage), TanStack Query (we have no
server state — the category is empty in a local-first app), Context alone (re-render
pain on the logging hot path), MobX/Legend-State (thinner AI familiarity).

## 6. Monetization: expo-iap (one-time Supporter unlock)

**Decision.** `expo-iap` for the single non-consumable Supporter purchase.
**This amends the original plan**, which named `react-native-iap` — that library was
deprecated by its maintainer and archived (April 2026); expo-iap is his successor
project, an Expo Module implementing the OpenIAP spec.

**Why.** Same battle-tested lineage (2017–) under the maintained name; tracks Google's
rolling Play Billing version deadlines (v8+ mandatory for updates from Aug 2026 —
an archived library is a compliance dead end); Expo Module, so zero manual native
config; StoreKit 2 support keeps the iOS door open.

**Architecture rule.** All purchase logic sits behind an app-owned `Entitlements`
interface in `core/integrations` (is-supporter check, purchase, restore) with one thin
expo-iap adapter. Features and tests only ever see the interface. Client-side
entitlement is proportionate protection for
a cosmetic thank-you unlock; no backend, no receipt server.

**Alternatives considered.** RevenueCat (subscription machinery we don't need, ~1% fee,
and a mandatory third-party data dependency that contradicts "no tracking");
Adapty/Qonversion (same category); hand-rolled Play Billing (edge cases —
acknowledgment windows, pending transactions, restores — are where solo projects bleed).

## 7. Design system: custom tokens + primitives; Victory Native for charts

**Decision.** No UI/styling library. A thin custom design system:
- **Semantic tokens** (typed TS): `color.surface`, `color.accent`, `spacing.md`,
  type scale — one token set per theme family (Iron, Chalk, …), each with light and
  dark palettes plus its own shape and type; dark follows the phone's setting.
- **Typography:** the Android system font (Roboto) for v1 — no font loading, no native
  build; a custom family later is a token change.
- **Look:** Iron, picked in a mockup round (September 2026). The examples in
  `docs/design/` are style references, not layout specs.
- **~10 primitives** (`Screen`, `Text`, `Button`, `Card`, `Input`, …): thin wrappers
  over RN built-ins reading tokens from theme context, plain `StyleSheet`.
- **Complex components are imported, wrapped, and tokened — never hand-rolled and
  never exposed raw**: Victory Native (Skia + Reanimated) behind chart wrapper
  components (`TrendChart`, `WeeklyBarChart`); `@gorhom/bottom-sheet` when needed.
  Feature code composes only design-system components.

**Why.** Theming is the *product's paid feature* (Supporter palettes) — the token
architecture must be fully ours, not a library's abstraction. The app needs ~10
primitives and zero complex widgets besides charts. A closed, typed vocabulary is
the best AI target: the whole system fits in context, every usage is typechecked,
generated screens are consistent by construction. Zero dependency churn.

**Alternatives considered.** Unistyles (closest runner-up; same philosophy with nicer
ergonomics — door stays open cheaply since it's StyleSheet-shaped), NativeWind
(className strings are invisible to `tsc` — weakens the verification story), Tamagui
(largest magic surface, churn-prone upgrades), Paper/gluestack (fighting a component
library's aesthetic is more work than owning ten components; Material look would
undercut a differentiated consumer app).

## 8. Testing: the verification ladder

Strategy: **test behavior at stable boundaries, never internals.** Four layers ordered
by speed; the fast layers catch almost everything so the slow layers stay tiny.

- **Layer 0 — static (seconds, every edit):** strict `tsc` + ESLint. The workhorse
  against AI-generated mistakes; widened deliberately by stack choices (typed queries,
  typed tokens).
- **Layer 1 — unit (seconds):** pure `core/domain` only. Golden tests pin outputs to
  published RTS RPE→%1RM chart values; property-based tests (fast-check) assert
  invariants (e1RM monotonicity, CSV round-trip) across generated inputs.
- **Layer 2 — integration (tens of seconds, headless; the bulk of the suite):**
  - Repository tests against **real SQLite in-memory** (better-sqlite3 driver in
    Jest) running the real checked-in migrations — schema, queries, soft-delete
    filtering, aggregations. No DB mocks anywhere.
  - Screen tests with **React Native Testing Library**: query by visible text /
    accessibility labels, real Zustand stores, real repositories on in-memory
    SQLite; navigation via expo-router's `renderRouter` where flows matter.
- **Layer 3 — E2E (minutes, emulator):** **Maestro**, 5–8 smoke flows total (log a
  workout; kill/relaunch mid-session; history + chart; CSV export; theme switch).
  Runs on merge to main / nightly — never in the per-PR loop.

**Test data and mocking** (the rules: `.claude/rules/testing.md`). Deterministic
factories (`makeSet({ rpe: null })`) so every failure reproduces; real repositories
instead of mocks so tests exercise real SQL, not assumptions about it. Only the
app-owned integrations in `core/integrations` may be faked; needing any other mock
means a boundary is missing (§9). Mocks shipped by the jest-expo preset or a
library's official Jest setup (Reanimated, Skia) don't count: native code can't run
in Node, so they are test environment, not fakes. No snapshot tests: they break on
harmless refactors and get re-approved unread. fast-check is the one sanctioned
randomness because it shrinks failures and reports the seed.

**Coverage:** per-layer thresholds, not a global number — ~95% `core/domain`,
~90% repositories; UI covered by meaningful flows, not percentages.

**Alternatives considered.** Detox (more powerful sync, far more setup/maintenance —
wrong trade solo); mock-based repository tests (tests would pass against assumptions
instead of real SQL); global coverage targets (manufactures brittle internals-poking
tests).

## 9. Architecture: feature slices + shared core

**Decision.** Vertical feature slices over a shared kernel, borrowing hexagonal
seams without the ceremony: thin routes in `src/app`, one folder per feature in
`src/features/*`, a shared `src/core` (db, domain, design-system, integrations),
test infrastructure in `src/test`. The folder layout and dependency rules are in
CLAUDE.md ("Structure", "Architecture rules"), enforced by `eslint.config.js`.

`core/integrations/` is what hexagonal architecture calls ports and adapters, under
a plain name (renamed from `ports/`, September 2026; "services" was rejected because
it usually means business logic): one app-owned interface per OS or store API, plus
one adapter wrapping the real library. Every integration lives there, even one only
a single feature uses, and nothing else does — so the mockable surface stays a
single folder (§8) and shared integrations (purchases gate themes, icons and export
formats) never need to move. Business logic lives in the feature, or in
`core/domain` as pure functions when shared.

**Why.** Working on a feature touches one folder; the seams (domain, repositories,
integrations) are exactly where tests attach and where a future sync engine plugs in; lint
enforcement makes the structure self-defending against both human and AI shortcuts.

**Alternatives considered.** Layer-based folders (features smear across the tree,
`utils/` landfill); full Clean/Hexagonal (use-case classes wrapping single repository
calls — ceremony a 5-feature app can't pay for).

## 10. CI

GitHub Actions on every PR: typecheck + lint + Jest (layers 0–2) + a Metro Android
bundle (`expo export`), as one required check — fast enough for the AI's inner loop,
complete enough that green means mergeable. The bundle step catches what tsc and
Jest can't see (Metro resolution, assets, config) in ~10s; a native Gradle build
would take 10+ minutes and buys nothing until the app has custom native code.
Maestro smoke suite on an Android emulator runs on main/nightly.

## 11. Work tracking: GitHub Issues

**Decision.** The plan and all open work live in GitHub Issues on this repo; a PR
that finishes an issue closes it (`Closes #N`). A GitHub Projects board can sit on
top when a board view is wanted (decided September 2026).

**Why.** Free with no limits, next to the code and PRs, and issues close on merge.
Claude reads and updates them through GitHub, so sessions on any machine see the
same plan.

**Alternatives considered.** Linear (nicer UI and planning features, but the free
plan blocks new issues past 250, and it's a second tool to keep in sync); a
`roadmap.md` in the repo (visible, but nothing closes automatically, so it drifts).

**Watch-outs.** Issues on a public repo are public.
