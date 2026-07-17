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
| **4. Website (demo)** | [`site/index.html`](site/index.html) | Working single-page site: sign up, browse every athlete, view PR profiles with Bestmark Scores |

## Running the website

`site/index.html` is fully self-contained — no build step, no server, no dependencies. Open it directly in a browser, or serve the `site/` folder with any static host (GitHub Pages works as-is). Sign-ups persist in the browser via localStorage; the directory ships with eight seeded athletes carrying verified marks so stats are browsable immediately.

## The decision, in brief

Three concepts were pitched and scored on pain size, differentiation, feasibility, monetization, and defensibility. **Bestmark won (4.60 / 5 weighted)** because it *contains* the other two: the universal score becomes a feature on top of trustworthy aggregated data, and the rivalry graph becomes the v2 retention layer — while the reverse sequencing fails for lack of credible data. MVP = ingest + claim + verified PR profile; v1.5 = Bestmark Score + leaderboards; v2 = rivalry graph + club dashboards.
