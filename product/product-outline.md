# Bestmark — Product Conceptual Outline v1.0

*Concept: verified multisport PR passport (winner in [`../concepts/concept-pitches.md`](../concepts/concept-pitches.md)). This is the founding spec: personas, features, information architecture, data model, and phased roadmap.*

---

## 1. Personas

| Persona | Profile | Core job-to-be-done |
|---|---|---|
| **Maya, 44 — age-group triathlete** | 6–10 races/yr across tri, running, open-water swims; data scattered across 6 platforms | "Show me — and everyone else — everything I've proven, in one place." |
| **Raj, 61 — masters runner-swimmer** | parkrun regular, USMS meets; obsessed with age-grade % | "Let me compete meaningfully against younger athletes and my own aging curve." |
| **Coach Elena — club coach, 120 athletes** | Selects relay/meet squads, tracks progression | "Roster-wide PRs and trends without a spreadsheet." |
| **Sam, 17 — HS swimmer/runner** | College recruiting | "A credible one-link athletic résumé." |
| **Dana — race director** | 5K–70.3 events | "Engage finishers after the race and seed corrals fairly." |

## 2. Core product loops

1. **Claim loop (acquisition):** race happens → results ingested → unclaimed profiles indexed/searchable → athlete finds self → claims → invited to claim teammates/rivals on the same results page.
2. **PR loop (retention):** new result → PR/Score detection → celebration + share card → followers notified → their next race matters more.
3. **Compare loop (engagement):** follow → side-by-side profiles → leaderboards (club, age-group, distance) → rivalry graph (v2).

## 3. Feature set

### MVP (Phase 1)
- **Results ingestion** from public race results + CSV/manual import with verification tiers: `MARKED` (timing-source), `FEDERATION` (USMS/USATF/USAT export), `LOGGED` (self-reported; excluded from ranks).
- **Athlete profile:** header (name, clubs, sports), **PR board** (best per sport × event/distance × course type), race history timeline, season view.
- **Claiming & identity:** search by name/race; claim with evidence heuristics (DOB, hometown, co-occurrence); merge/split tooling; dispute + opt-out flows.
- **Public share link** `@handle` + PR share cards (image render).
- **Follow & compare:** follow athletes; two-profile side-by-side.

### Phase 1.5 — the Score
- **Bestmark Score (0–100)** per performance: age/gender-graded vs. WMA (run), USMS (swim), published tri/bike baselines; composite per sport and overall.
- Distance-based leaderboards: global / country / club / age-group at 5K, 10K, HM, M, sprint/oly/70.3/140.6, swim events.
- Progression analytics (premium): Score trajectory, PR probability curves.

### Phase 2 — the graph
- **Rivalry detection:** lifetime head-to-head from shared results; matchup pages; "rival is racing Sunday" notifications.
- **Club/team dashboards** (B2B): rosters, progression, seeding exports, recruiting view.
- **Organizer embeds:** "Results by Bestmark" widget with claim CTA; corral-seeding API.

### Explicit non-goals (v1)
No GPS activity tracking, no training plans, no route/segment features, no chat — Strava/Garmin do these; we integrate, not compete.

## 4. Information architecture

```
bestmark.com
├── /@handle                  # public athlete profile (SEO surface)
│   ├── PR board (default)    # bests by sport → event → course
│   ├── History               # every result, filterable
│   ├── Score                 # Bestmark Score trend + percentiles
│   └── Compare               # side-by-side vs. any athlete
├── /results/{race}/{year}    # race results page (claim surface, SEO)
├── /events/{event}           # event hub: editions, records, entrants
├── /leaderboards             # distance × age-group × geo × club
├── /clubs/{club}             # club page + (B2B) dashboard
└── /claim                    # search-yourself onboarding flow
```

## 5. Conceptual data model

```
Athlete (id, handle, name, dob†, gender†, country, clubs[], visibility)
Identity (athlete_id, source, source_ref, confidence, status: auto|claimed|disputed)
Event (id, name, sport, location, editions[])            # e.g. "Lakeside Triathlon"
Race (id, event_id, date, discipline, distance, course_type, timing_source)
Result (id, race_id, identity_ref, time, splits[], placements{overall,gender,ag},
        verification: MARKED|FEDERATION|LOGGED)
Mark (athlete_id, sport, event_class, course_type, result_id, standing: current|former)
Score (result_id, table_version, age_grade_pct, bestmark_score)
Follow (follower_id, athlete_id) · Claim (athlete_id, result_ids[], evidence, state)
```
† private by default; used for age-grading and match confidence only.

**Hard rules:** a `Result` never changes athletes silently (claims are auditable); `LOGGED` results never enter `Mark` standings or leaderboards; Score tables are versioned so historical scores are reproducible.

## 6. Ingestion & entity resolution (the hard part)

- Source adapters per timing platform/federation format; normalize to the `Result` schema with provenance retained.
- Candidate matching on (name, age/DOB-year, location, club, co-occurrence history); auto-link only above high confidence, otherwise queue as unclaimed.
- Claiming = human confirmation; the **Mark renders only post-claim**.
- Dispute and opt-out flows are first-class MVP features, not afterthoughts (trust is the product).

## 7. Success metrics by phase

| Phase | North star | Guardrails |
|---|---|---|
| MVP | Claimed profiles; claim rate of profile visits ≥ 8% | Dispute rate < 0.5%; ingestion accuracy ≥ 99.5% |
| 1.5 | WAU of claimed athletes ≥ 35% in season; share-card CTR | Score complaint volume; leaderboard integrity flags |
| 2 | Premium conversion 3–5%; club retention ≥ 90% | Rivalry opt-out rate; notification fatigue (unsubs) |

## 8. Suggested stack (when build begins)

- **Web-first** (SEO is the acquisition engine): Next.js/React + SSR profile/results pages; mobile apps after PMF.
- Postgres (results corpus is relational and modest-scale) + OpenSearch for name/race search; queue-based ingestion workers.
- Share-card image rendering service; versioned scoring-tables package with published methodology.
