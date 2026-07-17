# Concept Pitches — Three Ways to Attack the Gap

The gap identified in [`../research/market-research.md`](../research/market-research.md): **no single, verified, comparable athletic identity across run / swim / bike / tri.** Three distinct product concepts follow, then a weighted selection.

---

## Concept 1 — **Bestmark**: the verified PR passport

**One-liner:** *Every official result you've ever raced, one profile, one link.*

**What it is.** A pre-populated, claimable athlete profile that aggregates *official chip-timed and federation results* across running, swimming, cycling, and triathlon into a single page: PRs by event/distance/course, full race history, season progression, and a shareable public link (`bestmark.com/@you`) that works as an athletic résumé for clubs, coaches, recruiters, and rivals.

**Core mechanics**
- **Ingest first, claim second** (the Athlinks/SwimCloud growth loop): profiles exist from public results before users sign up; claiming your history is the activation moment.
- **Verified vs. logged split:** official results carry a verification mark and drive rankings; self-reported efforts can be logged but are visibly second-class (SwimCloud's proven integrity rule).
- **Bestmark Score:** an age/gender-graded 0–100 score per performance (WMA / USMS / Fair-model tables), rolled up per sport and overall — parkrun's age-grade psychology, applied cross-sport.
- **Follow anyone, compare anything:** side-by-side profiles, club leaderboards, distance-based global/age-group ranks (the thing Strava famously lacks).

**Why it wins:** attacks all three gap layers (aggregation + normalization + identity) with a self-reinforcing data moat: every claimed result improves search, every profile share recruits the people named on the same results page.

**Biggest risk:** results ingestion breadth is an operations grind; incumbent (Athlinks) owns a large corpus, requiring partnerships with the timing vendors it doesn't own.

---

## Concept 2 — **Apex Index**: the universal endurance score

**One-liner:** *One number that makes a 55-year-old swimmer and a 25-year-old marathoner comparable.*

**What it is.** A ratings company, not a results archive. Athletes connect whatever they already have (Strava, Garmin, race-result links, federation IDs); Apex computes a single normalized 0–1000 endurance rating (per sport + composite), with global, national, club, and age-group leaderboards. Think **chess Elo / golf handicap for endurance sport**.

**Core mechanics**
- Rating decays without racing, rewards breadth (multisport bonus), and is computed only from verifiable inputs.
- Leaderboards and percentile cards designed for social sharing ("Top 4% of women 40–44 worldwide").
- API licensing: race organizers seed corrals by Apex rating; brands segment sponsorships by rating tier.

**Why it wins:** the score is the product — light on data operations, heavy on virality; a handicap standard can become infrastructure the whole industry licenses.

**Biggest risk:** cold-start credibility. A rating nobody recognizes ranks nobody; without the underlying results archive, inputs lean on self-reported data, weakening the very trust the score depends on. Methodology disputes are existential (every angry forum thread is about *your core product*).

---

## Concept 3 — **Rivalry**: head-to-head racing, forever

**One-liner:** *Your race history is full of rivals you never knew you had.*

**What it is.** A social network built on **auto-detected head-to-head records**. Ingests race results and finds every athlete you've ever shared a start line with: lifetime win–loss records, margin trends, "nemesis" and "rival within 30 seconds" detection, and pre-race matchup cards ("You're 3–2 lifetime vs. J. Park — she's entered Sunday").

**Core mechanics**
- Rivalry graph mined from co-occurrence in results; notifications when a rival races, PRs, or enters your next event.
- Matchup pages with H2H splits by discipline (swim/bike/run legs in tri).
- Club-vs-club and team dual-meet modes.

**Why it wins:** the most emotionally sticky concept — rivalry is the oldest retention mechanic in sport, and nobody has productized it for amateurs. Strong differentiation from anything on the market.

**Biggest risk:** narrowest wedge — requires the same results-ingestion investment as Concept 1 but delivers value only to the competitive-minded subset; privacy sensitivities (being someone's tracked "rival" without consent) demand careful design; harder to monetize as a standalone.

---

## Selection

Weighted scoring (1–5 per criterion):

| Criterion | Weight | Bestmark | Apex Index | Rivalry |
|---|---:|---:|---:|---:|
| Size of addressable pain | 25% | **5** | 4 | 3 |
| Differentiation vs. incumbents | 20% | 4 | 4 | **5** |
| Feasibility of MVP | 20% | 4 | **5** | 3 |
| Monetization clarity | 15% | **5** | 3 | 3 |
| Defensibility / data moat | 20% | **5** | 3 | 4 |
| **Weighted total** | | **4.60** | 3.85 | 3.60 |

### Winner: **Bestmark** ✔

**Rationale.** Bestmark is the only concept that *contains* the other two: the age/gender-graded **Bestmark Score is Apex Index shipped as a feature** on top of trustworthy data, and the co-occurrence graph needed for **Rivalry is a natural v2 retention layer** once results are ingested. Run the sequence in reverse and it fails — a score without an archive lacks credibility (Apex's cold-start risk), and a rivalry graph without profiles lacks an audience. Bestmark also has the clearest monetization (athlete premium + club/team dashboards + timing-vendor API) and the strongest moat (claimed-results corpus + identity graph).

**Roadmap implication:** MVP = aggregation + claiming + verified PR profile. v1.x = Bestmark Score and leaderboards. v2 = rivalry graph. Full sequencing in [`../product/product-outline.md`](../product/product-outline.md).
