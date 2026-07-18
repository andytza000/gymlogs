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

**Sync-ready guardrails (baked into the first migration, permanent):**
- UUIDv7 primary keys on every table — never auto-increment integers.
- `created_at` / `updated_at` on every table.
- Soft deletes (`deleted_at`) on all user-data tables; repositories filter them out.
- The repository layer is the only DB access path — a future sync engine slots in
  behind it without touching features.

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

**Architecture rule.** All purchase logic sits behind an app-owned `EntitlementPort`
(is-supporter check, purchase, restore) with one thin expo-iap adapter. Features and
tests only ever see the port. Client-side entitlement is proportionate protection for
a cosmetic thank-you unlock; no backend, no receipt server.

**Alternatives considered.** RevenueCat (subscription machinery we don't need, ~1% fee,
and a mandatory third-party data dependency that contradicts "no tracking");
Adapty/Qonversion (same category); hand-rolled Play Billing (edge cases —
acknowledgment windows, pending transactions, restores — are where solo projects bleed).

## 7. Design system: custom tokens + primitives; Victory Native for charts

**Decision.** No UI/styling library. A thin custom design system:
- **Semantic tokens** (typed TS): `color.surface`, `color.accent`, `spacing.md`,
  type scale — one token object per theme (light/dark now; Supporter themes later).
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

**Test data:** deterministic factories with overrides (`makeSet({ rpe: null })`),
typed off Drizzle's `$inferInsert`; scenario builders seed through the real
repositories; fixed base timestamp + fake timers; no faker-style randomness.
fast-check is the only sanctioned randomness (shrinking + reported seed).
Factories and fakes live in `src/test/`.

**Mocking policy:** mock nothing by default. The only mockable things are app-owned
ports (entitlements, file-share); one canonical fake per port in `src/test/fakes.ts`.
Never deep-mock third-party APIs; never `jest.mock()` internal modules (that's a
missing-boundary smell); assert on state, not interactions, except where the call is
the outcome. No broad snapshot tests. Zero tolerance for flake.

**Coverage:** per-layer thresholds, not a global number — ~95% `core/domain`,
~90% repositories; UI covered by meaningful flows, not percentages.

**Alternatives considered.** Detox (more powerful sync, far more setup/maintenance —
wrong trade solo); mock-based repository tests (tests would pass against assumptions
instead of real SQL); global coverage targets (manufactures brittle internals-poking
tests).

## 9. Architecture: feature slices + shared core

**Decision.** Vertical feature slices over a shared kernel, borrowing hexagonal
seams without the ceremony:

```
src/app/        expo-router routes only — thin, no logic
src/core/       shared kernel:
                  db/            schema, migrations, repositories
                  domain/        pure functions (RPE, e1RM, volume, CSV)
                  design-system/ tokens, primitives, chart wrappers
                  ports/         entitlements, file-share (+ their adapters)
src/features/*  one folder per feature: screens, components, hooks, store
src/test/       factories, scenario builders, fakes
```

**Dependency rules (ESLint-enforced, not just convention):**
- Features import from core; core never imports from features.
- Features never import from each other — shared code graduates to core.
- All DB access through repositories; OS edges only via ports.

**Why.** Working on a feature touches one folder; the seams (domain, repositories,
ports) are exactly where tests attach and where a future sync engine plugs in; lint
enforcement makes the structure self-defending against both human and AI shortcuts.

**Alternatives considered.** Layer-based folders (features smear across the tree,
`utils/` landfill); full Clean/Hexagonal (use-case classes wrapping single repository
calls — ceremony a 5-feature app can't pay for).

## 10. CI

GitHub Actions on every PR: typecheck + lint + Jest (layers 0–2), targeted as required
checks — fast enough for the AI's inner loop, complete enough that green means
mergeable. Maestro smoke suite on an Android emulator runs on main/nightly.
