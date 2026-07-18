# Bestmark — Market-Ready Founding Package

> **Every best. On the record.**
> A verified, cross-sport athlete profile: all official race results and PRs for runners, swimmers, cyclists, and triathletes — one profile, one shareable link, one comparable score.

This repository contains the complete founding package for **Bestmark**, produced from parallel market research through concept selection to foundational deliverables.

## The opportunity in one paragraph

The endurance-event market is ~$11B and growing ~8%/yr, yet an athlete's official results are scattered across sport- and vendor-specific silos: Athlinks (running-centric, 2.2★ app, stagnant), SwimCloud (swimming only), Strava (training data — self-reported, not official), and a half-dozen timing platforms per athlete. **No product offers a single, verified, comparable athletic identity across running, swimming, cycling, and triathlon.** Bestmark fills that gap: pre-built claimable profiles from official results, a PR board with a verification Mark, and an age/gender-graded Bestmark Score (0–100) that makes a 61-year-old swimmer and a 25-year-old marathoner meaningfully comparable — parkrun's beloved age-grade psychology, productized across sports.

## Package contents

| Deliverable | File | What's inside |
|---|---|---|
| **1. Market research** | [`research/market-research.md`](research/market-research.md) | Market sizing, competitor teardown, the underserved gap and why it persists, sourced throughout |
| **2. Concept pitches** | [`concepts/concept-pitches.md`](concepts/concept-pitches.md) | Three concepts — Bestmark (PR passport), Apex Index (universal score), Rivalry (head-to-head network) — weighted selection matrix and winner rationale |
| **3a. Brand guidelines** | [`brand/brand-guidelines.md`](brand/brand-guidelines.md) | Name, tagline, logo direction, palette, typography, voice & tone, the Mark |
| **3b. Business plan** | [`business/business-plan.md`](business/business-plan.md) | TAM/SAM/SOM, revenue model, growth engine, GTM phases, costs, risks, metrics |
| **3c. Product outline** | [`product/product-outline.md`](product/product-outline.md) | Personas, core loops, feature phasing, IA, data model, ingestion strategy, stack |
| **4. Static demo** | [`site/index.html`](site/index.html) | Self-contained single-page demo (localStorage sign-ups) — open directly in a browser |
| **5. Web app (Next.js)** | [`web/`](web/) | The real application: accounts, shared database, public athlete profiles, Training Hub, AI coach — now an installable PWA |
| **6. Mobile / App Store** | [`mobile/`](mobile/) | Capacitor native shell + [`APP-STORE-GUIDE.md`](mobile/APP-STORE-GUIDE.md) with the full submission walkthrough |

## Running the web app

The Next.js app in `web/` is the production-track version — sign-ups are real accounts stored in a shared SQLite database, so every visitor sees every athlete.

```bash
cd web
npm install
npm run build && npm start   # or: npm run dev
```

Then open http://localhost:3000. The database (`web/data/bestmark.db`, auto-created and auto-seeded with eight verified athletes) is git-ignored.

**Features:** sign-up with password (scrypt-hashed) and session cookies, log in/out, athlete directory with search and sport filters ranked by Bestmark Score, public profile pages at `/athletes/[handle]`, add/update-PR for your own profile (self-reported PRs display as "logged", seeded official results as "✓ marked"), a **Training Hub** (`/articles`) with PR-improvement guides across all four sports and curated external reading, and an **AI coach** (`/coach`) — a chat that grounds training advice in the logged-in athlete's actual PRs.

**Official results ingestion:** competition results flow in through `POST /api/import` (authenticated with the `x-import-key` header — set `BESTMARK_IMPORT_KEY` in production; a demo key `demo-import-key` applies when unset). Timing companies or race directors send either JSON (`{ race: { name, event, date, location }, results: [{ name, time, place }] }`) or CSV (`{ race: {...}, csv: "place,name,time\n..." }`). Finishers whose names match registered athletes are attached automatically and their PRs get the ✓ mark; everyone else appears as *unclaimed* on the race page (`/results`) with a "That's me — claim" button. Claimed or auto-matched official times always outrank self-reported ("logged") entries on the PR board, and claimed races appear as verified race history on the athlete's profile.

**AI coach configuration:** set `ANTHROPIC_API_KEY` in the server environment to enable the full coach (Claude Opus 4.8 via the official `@anthropic-ai/sdk`). Without a key, the coach falls back to a built-in deterministic plan that computes easy/tempo/interval paces from the athlete's best PR, so the feature works out of the box.

The static `site/index.html` demo remains for zero-setup previewing; its sign-ups are browser-local only.

## The decision, in brief

Three concepts were pitched and scored on pain size, differentiation, feasibility, monetization, and defensibility. **Bestmark won (4.60 / 5 weighted)** because it *contains* the other two: the universal score becomes a feature on top of trustworthy aggregated data, and the rivalry graph becomes the v2 retention layer — while the reverse sequencing fails for lack of credible data. MVP = ingest + claim + verified PR profile; v1.5 = Bestmark Score + leaderboards; v2 = rivalry graph + club dashboards.
