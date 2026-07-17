# GymLogs

A free, local-first workout logger for Android built around **RPE and autoregulated training** — log simply, analyze smartly.

## Vision

Most workout trackers treat RPE (Rate of Perceived Exertion) / RIR (Reps in Reserve) as a passive
note field. GymLogs makes it the engine: every analytic in the app understands how hard a set
actually was, so your progress data stays honest even when every set is submaximal — which is
exactly how evidence-based training works.

The product philosophy in one line: **as simple to log as FitNotes, as smart to read as a coach's
spreadsheet.**

## Core principles

- **Everything free.** All logging and all analytics are free, forever. No feature paywalls.
- **Local-first, no login.** All data lives on the device. No account, no backend, no tracking.
  Full data export (CSV) at any time — your training history is yours.
- **Simple logging, smart analytics.** The logging screen stays dumb-simple: weight, reps,
  optional RPE. The intelligence lives in the read-only analytics layer.
- **No clutter.** A small set of features done well beats a hundred half-features. Dark mode
  included, obviously, for free.

## What makes it different

1. **RPE-adjusted estimated 1RM.** 1RM trend charts use the RTS/Tuchscherer RPE→%1RM mapping
   (e.g. 5 reps @ RPE 8 ≈ 81% of 1RM) instead of plain rep-based formulas that ignore effort.
   Your e1RM line reflects reality across an entire submaximal training block — no competitor's
   free tier does this, and the market leader doesn't do it at all.
2. **Hard sets per muscle group per week.** Volume tracking the way hypertrophy research frames
   it: working sets taken close to failure, per muscle, per week — free, with full history.
3. **Autoregulation-lite.** Optional suggested load for today's target RPE, computed from your
   recent RPE-adjusted e1RM. One hint, not a programming engine — the app never gets in the way.

## Monetization

The FitNotes model: the app is fully free, with a single **one-time "Supporter" in-app purchase**
that unlocks small cosmetic extras (additional themes, icon packs, extra export formats) as a
thank-you. No subscription, no ads, no backend costs. Revenue is a slow-compounding dividend on
product quality and community word-of-mouth — not the reason the app exists.

## Scope for v1

- Exercise database + custom exercises
- Fast set logging: weight, reps, optional RPE/RIR
- Workout history and per-exercise progress
- RPE-adjusted e1RM trend charts
- Hard sets per muscle group per week chart
- CSV export / import
- Dark mode
- Supporter one-time IAP (Play Billing)

Explicitly **out of scope for v1**: accounts, cloud sync, social features, program marketplaces,
AI coaching. Local-first Android only (Room/SQLite), which keeps running costs at zero and the
maintenance surface small.

## Long-term

If the app earns a real community, later phases may add optional cloud backup and social features —
but only funded by demonstrated demand, never at the cost of the local-first, no-login core.

## Audience

Lifters in the evidence-based training community (RPE/RIR-based hypertrophy and strength training)
who want a logger that speaks their language, and anyone who wants a clean, fast, private gym log
without a subscription.
