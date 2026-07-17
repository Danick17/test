# Market Research — Multisport Personal Records & Athlete Stats Platform

*Compiled 2026-07-17. Research conducted across market reports, competitor documentation, app-store sentiment, and community sources. All external claims are linked in [Sources](#sources).*

---

## 1. Market context

### Market size and growth

- The global **endurance sports event market reached ~USD 11.2B in 2024** and is projected to grow at **~8.3% CAGR through 2033** (to ~USD 21B+). Broader estimates place the 2024 market as high as USD 21.4B growing to USD 42.2B by 2033.
- **Running is the largest segment** — marathons and half-marathons alone account for **40%+ of total market revenue**. Over **50 million people in the U.S.** run or jog annually; women now make up 44% of mass-participation running event finishers.
- **Triathlon** was valued at **~USD 3.8B in 2025**, projected to reach USD 6.7B by 2034. World Triathlon reported a **31% increase in licensed athletes between 2019 and 2024**, passing **4.5 million registered national-federation athletes**.
- Fitness-app economics validate the category: **Strava passed 195M registered users / ~50M MAU** and is approaching **$500M annual revenue**, ~90% of it from subscriptions, at only ~2% premium penetration — evidence that endurance athletes pay for performance tooling and that even low conversion rates support a large business.

### Behavioral tailwinds

- **Age grading is beloved where it exists.** parkrun's age-grade percentage is one of its most discussed features — "the great leveller" that lets a 60-year-old woman and a 25-year-old man compare performances meaningfully. Athletes anchor identity to thresholds (80% = national class, 70% = regional class).
- **Race results are social objects.** Athletes already screenshot results pages, maintain "athletic résumés" for clubs, college recruiting, and sponsors, and want measurable, verifiable proof of performance (personal bests, progression over seasons).
- **Multisport identity is growing.** Triathlon's licensed-athlete growth, the run-club boom, and masters swimming mean more athletes hold PRs across *several* sports — but no platform treats them as one athlete.

---

## 2. Competitive landscape

| Platform | Sports | Strengths | Critical weaknesses |
|---|---|---|---|
| **Athlinks** (Life Time / ChronoTrack) | Run-centric; some tri, OCR, swim | Largest US race-results database; result claiming | **2.2/5 App Store rating**; login/claiming failures; missing results; dated UI; can't add races outside its DB; weak international coverage; no cross-sport normalization |
| **Strava** | All activities (training) | 195M users; segment/social engine; strong brand | **Training data, not official results**; segments are route-based, "no simple way to see where you rank globally at your 5K or marathon time"; paywall creep resentment; no verified PRs |
| **SwimCloud** | Swimming only | Excellent rankings model (1000-point performance scores, weighted top-4 events, official-results-only integrity); recruiting Power Index | Single sport; NCAA/club focus; masters and open-water underserved; no run/bike/tri |
| **World Triathlon / PTO stats** | Triathlon (elite only) | PTO built stats.protriathletes.org because tri data was "limited and disparate" | **Pros only** — age-groupers (99% of the sport) excluded |
| **Timing platforms** (Sportstats, RACE RESULT, RTRT, RunSignup) | Per-race silos | Authoritative source data | Each race lives on whichever platform timed it; an athlete's history is scattered across 5–10 sites |
| **Age-grading calculators** (runbundle, WMA tables, USMS, Fair/Yale) | Run + swim tables exist | Proven, standardized methodology | One-shot calculators; no persistence, no profile, no cross-sport score, no community |
| **SportTracks / Runify / PR-tracker apps** | Various | PR detection from GPS/training data | Self-reported, unverified; no official results; tiny networks |

### Structural observations

1. **The data exists but is fragmented by sport and by timing vendor.** SwimCloud proves per-sport aggregation works; Athlinks proves cross-race claiming works; nobody has combined them across sports.
2. **Verification is the moat nobody markets.** Strava times are self-reported GPS; official chip-timed results are trusted currency. SwimCloud explicitly excludes manual times from rankings — and athletes respect it for that.
3. **Comparison across age/gender/sport is a solved science but an unshipped product.** WMA and USMS tables plus the Fair (Yale) cross-sport models exist in academic/calculator form only.
4. **Incumbent neglect.** Athlinks — the closest incumbent — has visibly stagnated (app rating, UI, claiming friction) under a timing-hardware parent company whose incentive is selling race services, not athlete experience.

---

## 3. The underserved gap

> **No platform gives the everyday endurance athlete a single, verified, comparable athletic identity across running, swimming, cycling, and triathlon.**

Concretely, a 45-year-old age-group triathlete today has:

- run PRs on Athlinks (some races missing, app barely works),
- swim times on SwimCloud or a USMS results page,
- bike/tri splits scattered across Sportstats, RACE RESULT, and Ironman's site,
- training data on Strava that proves nothing officially,
- and **no way to (a) show it all in one shareable profile, or (b) compare fairly with a 26-year-old runner or a 60-year-old swimmer.**

The gap has three reinforcing layers:

| Layer | Unmet need | Evidence |
|---|---|---|
| **Aggregation** | "All my official results and PRs in one place" | Athlinks 2.2★, tri data "limited and disparate," per-vendor silos |
| **Normalization** | "Compare me fairly across age, gender, and sport" | parkrun age-grade obsession; WMA/USMS/Fair tables unproductized; Strava has no distance-based rank |
| **Identity & sharing** | "One link that proves what I've done" — for clubs, coaches, recruiting, rivals, and pride | Athletic-résumé demand; result screenshots as social currency; SwimCloud's recruiting Power Index (single sport) |

### Why this gap persists

- Timing vendors own result data but monetize race directors, not athletes — athlete UX is a cost center to them.
- Sport federations are silos by construction (USA Swimming ≠ USATF ≠ USA Triathlon).
- Strava's model is built on self-reported GPS activities; retrofitting verified official results would undercut its own segment/leaderboard economy.
- The cross-sport score requires combining actuarial tables from different governing bodies — unglamorous work with a network-effect payoff that only makes sense as the *core* of a product, not a feature.

### Who feels it most (beachhead populations)

1. **Age-group triathletes (~2M active worldwide, 4.5M licensed multisport athletes)** — by definition multisport; their data is the most fragmented; they are the highest-spending endurance demographic.
2. **Masters athletes (35+)** — the fastest-growing endurance cohort; age grading is *the* mechanism that keeps competition meaningful for them.
3. **Club/team athletes and their coaches** — need roster-wide PR and progression views for selection, seeding, and recruiting.

---

## 4. Conclusion

The market is large, growing ~8% annually, and dominated by single-sport or single-purpose incumbents with visible, documented neglect at exactly the point of athlete identity. The winning wedge is **a verified, cross-sport PR profile with a normalized comparison score** — Athlinks' claiming model + SwimCloud's ranking integrity + parkrun's age-grade psychology, unified across run/swim/bike/tri. The three product concepts in [`../concepts/concept-pitches.md`](../concepts/concept-pitches.md) attack this gap from different angles.

---

## Sources

- [Endurance Sports Event Market Research Report 2033 (Dataintelo)](https://dataintelo.com/report/endurance-sports-event-market)
- [Endurance Sports Event Market (Growth Market Reports)](https://growthmarketreports.com/report/endurance-sports-event-market)
- [Triathlon Market Research Report 2034 (Dataintelo)](https://dataintelo.com/report/triathlon-market)
- [Triathlon participation data 2025 (SGI Europe)](https://www.sgieurope.com/consumer/sport-participation-triathlon-finds-a-new-consumer/120362.article)
- [Endurance Sports Industry Statistics (WifiTalents)](https://wifitalents.com/endurance-sports-industry-statistics/)
- [Fitt Insider — The Endurance Economy](https://insider.fitt.co/issue-no-146-the-endurance-economy/)
- [My Race Results vs Athlinks comparison](https://www.myraceresults.app/compare/vs-athlinks)
- [Athlinks Help Desk — claiming results](https://athlinks.zendesk.com/hc/en-us/articles/115000660764-How-do-I-find-and-claim-results-in-Athlinks)
- [Review of Athlinks (This Old Runner)](http://www.thisoldrunner.com/blog/review-of-athlinks-the-perfect-place-for-tracking-your-race-results)
- [Strava revenue, funding & growth (Sacra)](https://sacra.com/c/strava/)
- [Strava Revenue and Usage Statistics (Business of Apps)](https://www.businessofapps.com/data/strava-statistics/)
- [Inside the Business of Strava's $2.2B Fitness Empire (Trailwaves)](https://trailwaves.substack.com/p/inside-the-business-of-stravas-22b)
- [Best Strava Alternatives 2026 (Runify)](https://www.runifyapp.com/blog/best-strava-alternatives-2026)
- [SwimCloud — How performance rankings are calculated](https://support.swimcloud.com/hc/en-us/articles/360052519314-How-are-performance-rankings-calculated)
- [SwimCloud — Points systems and swimmer rankings](https://support.swimcloud.com/hc/en-us/articles/8526130409491-Understanding-the-Points-Systems-and-Swimmer-Rankings)
- [SwimCloud — Manually entered times policy](https://support.swimcloud.com/hc/en-us/articles/115007502607-Manually-Entered-Times-on-Swimcloud)
- [PTO launches definitive triathlon stats site (TRI247)](https://www.tri247.com/triathlon-news/elite/pto-triathlon-statistics-analytics-website)
- [Sportstats results platform](https://sportstats.one/)
- [RACE RESULT triathlon timing](https://www.raceresult.com/en/solutions/triathlon)
- [parkrun Support — Age grading](https://support.parkrun.com/hc/en-us/articles/200565263-4-5-Age-grading)
- [Age Grading — all you ever wanted to know (parkrun UK)](https://www.parkrun.org.uk/crathescastle/news/2023/08/30/age-grading-all-you-ever-wanted-to-know/)
- [Age Grading Calculator (runbundle)](https://runbundle.com/tools/age-grading-calculator)
- [Age Grading (U.S. Masters Swimming)](https://www.usms.org/fitness-and-training/articles-and-videos/articles/age-grading?Oldid=143)
- [Aging Tables for Swimming and Running (MOVE GOALS / Fair, Yale)](https://www.movegoals.com/aging-tables-swimming--running.html)
- [How to build an athletic resume (2aDays)](https://www.2adays.com/blog/how-to-build-a-jaw-dropping-athletic-resume-that-will-have-coaches-begging-for-you/)
- [Personal Records (SportTracks)](https://sporttracks.mobi/learnmore/personal-records)
- [Best triathlon training apps (220 Triathlon)](https://www.220triathlon.com/gear/tri-tech/best-triathlon-training-apps-review)
