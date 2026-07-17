# Bestmark — Business Plan v1.0

*The verified multisport PR passport. Market basis: [`../research/market-research.md`](../research/market-research.md). Concept selection: [`../concepts/concept-pitches.md`](../concepts/concept-pitches.md).*

---

## 1. Executive summary

Bestmark aggregates official race results across running, swimming, cycling, and triathlon into one claimable, verified athlete profile with an age/gender-graded **Bestmark Score** that makes any two athletes comparable. It occupies the trust layer incumbents have left open: Strava owns training, timing vendors own single races, SwimCloud owns one sport, and Athlinks — the nearest analogue — has demonstrably stagnated (2.2★ app, running-centric, no normalization). The model is freemium athlete subscriptions plus B2B (clubs/coaches, race organizers, timing-vendor API), following Strava's proof that ~2% premium conversion on a large endurance user base supports a ~$500M-revenue business.

---

## 2. Market opportunity

| | Definition | Estimate |
|---|---|---|
| **TAM** | Global endurance sports event market | **$11.2B (2024), 8.3% CAGR → $21B+ by 2033**; 50M+ US runners, 4.5M licensed multisport athletes worldwide |
| **SAM** | Athletes who finish ≥1 officially timed race/year in launch markets (US/CA/UK/AU/EU) | ~**30M athletes**; monetizable via subs + B2B at ~$8–12 blended ARPU potential |
| **SOM (yr 3)** | Competitive age-groupers, masters athletes, and multisport athletes reachable via clubs, triathlon, and masters communities | **2.5M registered / claimed profiles; ~100K paying** (4% conversion, within the 2–5% freemium fitness norm) |

**Beachhead:** age-group triathletes + masters athletes — the most multisport, most fragmented-data, highest-spend cohorts, concentrated in clubs and federation communities that adopt as groups.

---

## 3. Product & value proposition

- **Athletes (free):** claim your pre-built profile; all official results and PRs in one page; shareable `@handle` link; follow and compare.
- **Athletes (Premium):** Bestmark Score history and projections, age-group/global percentile ranks, season progression analytics, PDF/link athletic résumé export, rivalry insights (v2).
- **Clubs & coaches (B2B SaaS):** roster dashboards, PR/progression tracking, meet/race seeding exports, recruiting views (SwimCloud's Power Index precedent, but multisport).
- **Race organizers & timing vendors (API):** free ingestion + verified-results badge; paid API for seeded corrals by Bestmark Score, participant insights, and post-race engagement widgets that link finishers to their profiles.

## 4. Revenue model

| Stream | Price | Notes |
|---|---|---|
| Bestmark Premium | **$5.99/mo or $49/yr** | Deliberately undercuts Strava ($11.99/mo) — complement, not replacement |
| Club/Team plans | **$199–$999/yr** by roster size | Sold through club officers; drives member acquisition loops |
| Organizer/timing API | **$0.10–0.25 per finisher** + enterprise tiers | Data partners get revenue share to align incentives |
| (Later) Sponsored segments | Brand challenges on verified results | Only after scale; never compromises the Mark |

**Year-3 illustrative mix:** 100K premium ($4.9M) + 1,500 clubs ($600K) + API/organizer ($1.0M) ≈ **$6.5M ARR**.

## 5. Growth engine

1. **Ingest-then-claim loop:** public results create millions of unclaimed profiles; athletes discover themselves via search/SEO ("[name] marathon results") and claim — the activation event. This is how Athlinks and SwimCloud grew, executed with modern UX.
2. **Results-page virality:** every claimed race exposes the unclaimed finishers around you; "invite your rival" prompts.
3. **Share cards:** PR and Score cards designed for Instagram/Strava cross-posting (parkrun age-grade psychology).
4. **Club-led adoption:** one club plan onboards 50–500 athletes at once.
5. **Organizer partnerships:** "Results by Bestmark" embeds put the claim button at the moment of maximum emotion — the finish line.

## 6. Competition & moat

Detailed teardown in the market research doc. Positioning against the two that matter:

- **vs. Strava:** not a training log — the verified record. Integration, not war: connect Strava for training context; Bestmark holds what's official.
- **vs. Athlinks:** modern UX, multisport normalization, a score worth sharing, and athlete-first incentives (Athlinks' parent monetizes timing hardware).

**Moat, in order of durability:** (1) claimed-identity graph — athletes won't rebuild their verified history elsewhere; (2) results corpus + entity-resolution quality; (3) the Bestmark Score as an industry standard once organizers seed corrals with it; (4) timing-vendor revenue-share partnerships.

## 7. Go-to-market phases

| Phase | Focus | Milestones |
|---|---|---|
| **0–6 mo** | US triathlon + masters running/swimming; ingest top-20 timing sources; 50 pilot clubs | 250K unclaimed profiles ingested; 25K claimed; NPS > 50 among claimers |
| **6–18 mo** | Premium launch; Score leaderboards; organizer embeds; UK/CA/AU | 500K claimed; 3–4% premium conversion; 10 timing/organizer partnerships |
| **18–36 mo** | Rivalry layer (v2); recruiting views; API standard for seeding | 2.5M claimed; $6M+ ARR; Score used for corral seeding at 100+ events |

## 8. Cost structure & team (first 18 months)

- **Team of 6–8:** 2 data engineers (ingestion/entity resolution — the hard core), 2 product engineers, 1 designer, 1 community/partnerships, founder(s).
- **Major costs:** payroll (~80%), infrastructure (results corpus is small data by modern standards — low seven-figures of rows, cheap), data-licensing/partnership fees.
- **Estimated burn:** ~$1.2–1.6M/yr → seed round of **$2.5–3M** buys runway to the premium-launch proof point.

## 9. Risks & mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| **Results-data access** (ToS, licensing; facts aren't copyrightable but access can be gated) | High | Partnership-first with revenue share; federation data agreements; athlete-initiated imports as legal fallback (athlete's own data) |
| **Entity resolution errors** (wrong person's results) | High | Conservative auto-match + human-confirmed claiming; dispute flow; the Mark only after claim confirmation |
| **Cold start / claim inertia** | Medium | Beachhead concentration (clubs, tri), finish-line embeds, SEO on name+race queries |
| **Athlinks/Strava responds** | Medium | Speed on multisport normalization — neither incumbent's business model rewards building it; partnerships lock timing supply |
| **Score methodology disputes** | Medium | Publish methodology openly; anchor to WMA/USMS standards; version the tables |
| **Privacy objections** (public results ≠ desire for a profile) | Medium | One-click de-index/opt-out honored corpus-wide; minors' data policies conservative by default |

## 10. Key metrics

Activation: claim rate of visited unclaimed profiles (target 8%+). Engagement: WAU/MAU of claimed athletes (target 35%+ in season). Growth: K-factor from results-page invites (target > 0.4). Revenue: premium conversion (target 3–5%), club logo retention (target 90%+). Trust: entity-resolution dispute rate (< 0.5% of claims).
