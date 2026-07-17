// Training Hub articles. Content is stored as simple blocks: h2 headings,
// paragraphs, and bullet lists, rendered by the articles pages.
export const ARTICLES = [
  {
    slug: 'break-your-5k-pr',
    sport: 'run',
    title: 'How to Break Your 5K PR: The 8-Week Framework',
    teaser: 'The 5K rewards a mix of speed and threshold work. Here is a proven structure for taking 30–90 seconds off your best.',
    minutes: 6,
    blocks: [
      ['p', 'The 5K sits at an awkward, wonderful intersection: it is short enough that raw speed matters and long enough that your aerobic engine decides the final mile. Most runners plateau because they train only one of those systems. The fix is a simple weekly structure that touches both.'],
      ['h2', 'The weekly skeleton'],
      ['ul', [
        'One interval session (VO2max): e.g. 5–6 × 800m at your current 5K race pace or slightly faster, with 2–3 minutes easy jog recovery.',
        'One threshold session: 20 minutes at a "comfortably hard" pace you could hold for about an hour — roughly 25–30 seconds per km slower than 5K pace.',
        'One long easy run: 60–90 minutes, fully conversational. This is where the aerobic base is built; going too fast here is the most common mistake.',
        'Two to three easy or rest days. PRs are made by the training you can absorb, not the training you can survive.',
      ]],
      ['h2', 'The two rules that matter most'],
      ['p', 'Rule one: 80% of your weekly volume should feel easy. Elite training studies consistently show an 80/20 easy-to-hard split outperforms "moderately hard every day." Rule two: progress one variable at a time — add reps, then shorten recoveries, then increase pace, never all three in the same week.'],
      ['h2', 'The final two weeks'],
      ['p', 'Taper by cutting volume roughly 40% while keeping one short, sharp session (e.g. 4 × 400m at goal pace) so the legs stay lively. On race day, run the first kilometre 2–3 seconds slower than goal pace — nearly every 5K PR is negative-split.'],
    ],
    links: [
      ['McMillan Running Calculator — find your training paces', 'https://www.mcmillanrunning.com/'],
      ['parkrun — free weekly timed 5Ks to test fitness', 'https://www.parkrun.com/'],
    ],
  },
  {
    slug: 'marathon-pacing',
    sport: 'run',
    title: 'Marathon Pacing: Why Even Splits Beat Heroic Starts',
    teaser: 'Almost every blown marathon dies in the same place — kilometres 32 to 38. The cause is nearly always the first 10K.',
    minutes: 7,
    blocks: [
      ['p', 'Marathon PRs are set with the head, not the legs. The physiology is unforgiving: run 10 seconds per km faster than your fitness allows in the first half, and you do not lose 10 seconds per km in the second half — you lose a minute per km, walking breaks included.'],
      ['h2', 'Glycogen is the budget'],
      ['p', 'You store roughly 90 minutes to 2 hours of race-pace glycogen. Pace discipline and fueling are how you stretch that budget across 42.2 km. Practically: take carbohydrate early and often (60–90g per hour, practiced in training), and treat the first 10K as a deliberate warm-up at goal pace, never faster.'],
      ['h2', 'The 10/10/10 mental model'],
      ['ul', [
        'First 10 miles (16K): run with your head. It should feel too easy. Bank nothing — "banked time" is borrowed at loan-shark interest.',
        'Middle 10 miles: run with your legs. Lock onto rhythm, fuel on schedule, stay boring.',
        'Final 10K: run with your heart. This is the only part of the race where "push" is the right instruction.',
      ]],
      ['h2', 'Choosing a goal time'],
      ['p', 'A reliable predictor: double your half-marathon time and add 10–20 minutes depending on your weekly mileage (closer to +10 at 80+ km/week, closer to +20 below 50 km/week). Choosing a goal from ambition instead of evidence is the most expensive mistake in the sport.'],
    ],
    links: [
      ['World Athletics — scoring tables and standards', 'https://worldathletics.org/'],
      ['TrainingPeaks blog — marathon fueling guides', 'https://www.trainingpeaks.com/blog/'],
    ],
  },
  {
    slug: 'swim-faster-technique',
    sport: 'swim',
    title: 'Swim Faster Without Getting Fitter: Technique First',
    teaser: 'Swimming is the one endurance sport where technique beats fitness. Drag reduction is worth more than any interval set.',
    minutes: 6,
    blocks: [
      ['p', 'In running and cycling, the fitter athlete usually wins. In swimming, the athlete with less drag usually wins. Water is roughly 800 times denser than air, so a small improvement in body position outperforms a large improvement in fitness. If your freestyle PRs have stalled, the fastest path forward is usually not harder sets — it is better shape in the water.'],
      ['h2', 'The big three, in order'],
      ['ul', [
        'Body position: head down, eyes at the pool bottom, hips high. If your legs sink, the fix is head position and core tension, not a harder kick.',
        'Timing and catch: a high-elbow catch ("reaching over a barrel") lets you press water backward instead of down. Pressing down lifts you; pressing back moves you.',
        'Rotation: rotate along the long axis with each stroke — it lengthens the stroke and recruits the back and core, not just the shoulders.',
      ]],
      ['h2', 'A simple technique week'],
      ['p', 'Replace one squad set per week with a drill session: 8 × 50 as 25 drill / 25 swim, cycling through catch-up, single-arm, and 6-kick-switch drills. Film yourself once a month from the side and front — most swimmers are shocked by the gap between how their stroke feels and how it looks.'],
      ['h2', 'Counting strokes'],
      ['p', 'Stroke count per length is the cheapest metric in the sport. Find your count at easy pace, then try to swim the same speed at one fewer stroke. Distance-per-stroke improvements show up directly in your 400m and 1500m times.'],
    ],
    links: [
      ['U.S. Masters Swimming — technique articles and workouts', 'https://www.usms.org/fitness-and-training'],
      ['SwimSwam — training and technique news', 'https://swimswam.com/'],
    ],
  },
  {
    slug: 'raise-your-ftp',
    sport: 'bike',
    title: 'Raising Your FTP: The Only Three Workouts You Need',
    teaser: 'Time-trial and triathlon bike splits are built on functional threshold power. Most riders overcomplicate how to raise it.',
    minutes: 5,
    blocks: [
      ['p', 'Your 40K time trial is essentially an FTP test with aerodynamics. Raising sustainable power is unglamorous work, and the industry sells a thousand fancy interval recipes — but decades of coaching practice keep returning to three sessions.'],
      ['h2', 'The three sessions'],
      ['ul', [
        'Sweet spot: 2–3 × 20 minutes at 88–94% of FTP. The workhorse — hard enough to drive adaptation, easy enough to repeat twice a week.',
        'Threshold: 2 × 15–20 minutes at 95–105% of FTP once the sweet-spot blocks feel manageable.',
        'VO2max: 5 × 4 minutes at 110–120% of FTP, in the final weeks before a goal event, to raise the ceiling that threshold sits under.',
      ]],
      ['h2', 'Everything else is easy'],
      ['p', 'Fill the remaining rides with genuinely easy endurance riding. The mistake that stalls most riders is making easy days too hard, arriving at interval days too tired to hit the numbers, and drifting into a grey zone where nothing improves.'],
      ['h2', 'Test, don’t guess'],
      ['p', 'Retest every 6–8 weeks — a 20-minute best effort times 0.95 is a serviceable FTP estimate. Log the result as a marked best: watching threshold power climb is the cycling equivalent of a new PR on the track.'],
    ],
    links: [
      ['TrainerRoad blog — structured cycling training', 'https://www.trainerroad.com/blog/'],
      ['TrainingPeaks — power training resources', 'https://www.trainingpeaks.com/blog/'],
    ],
  },
  {
    slug: 'triathlon-brick-workouts',
    sport: 'tri',
    title: 'Brick Workouts: Fixing the Worst Part of Your Triathlon',
    teaser: 'The run off the bike is where triathlon PRs are won and lost. Jelly legs are trainable — here is how.',
    minutes: 6,
    blocks: [
      ['p', 'Every triathlete knows the feeling: you come off a strong bike split and your legs belong to someone else for the first two kilometres of the run. That transition cost — often 60–90 seconds in an Olympic-distance race — is one of the most trainable weaknesses in the sport.'],
      ['h2', 'Why it happens'],
      ['p', 'Cycling recruits your muscles in a shortened, concentric pattern with no impact; running demands elastic, eccentric loading. The neuromuscular switch takes practice, and blood is still pooled in cycling-specific muscle groups when you hit the run course.'],
      ['h2', 'The brick progression'],
      ['ul', [
        'Beginner: 45 min ride + 10 min easy run, weekly. The run is about rehearsal, not fitness.',
        'Intermediate: 60–75 min ride with the last 20 min at race effort + 15–20 min run starting at race pace.',
        'Advanced: race-simulation bricks — 2–3 rounds of 20 min bike at race watts + 8 min run at race pace, practicing fueling and transitions between rounds.',
      ]],
      ['h2', 'Details that buy free time'],
      ['p', 'Ride the final 5 minutes of any race in a slightly easier gear at higher cadence (95+ rpm) to prime the legs. Practice flying mounts and dismounts monthly — transition is the fourth discipline, and 30 seconds saved there costs zero fitness. Start every brick run deliberately slow for 400m; the pace comes back to you faster when you do not fight the legs.'],
    ],
    links: [
      ['World Triathlon — rules, events, and rankings', 'https://triathlon.org/'],
      ['220 Triathlon — training guides', 'https://www.220triathlon.com/'],
    ],
  },
  {
    slug: 'recovery-and-age-grading',
    sport: 'run',
    title: 'Recovery, Aging, and Why Your Age-Graded Score Can Keep Rising',
    teaser: 'Raw times eventually slow with age. Your age-graded percentage does not have to — masters athletes PR on recovery.',
    minutes: 7,
    blocks: [
      ['p', 'Here is the liberating math of age grading: a 45:00 10K at age 60 scores higher than a 40:00 10K at age 30. Bestmark scores are age- and gender-graded for exactly this reason — the competition that matters is against the curve, not the clock. And the single biggest lever masters athletes have is not training harder; it is recovering better.'],
      ['h2', 'What actually changes with age'],
      ['p', 'VO2max declines roughly 10% per decade after 30 — but half of that decline is detraining, not aging. Recovery between hard sessions genuinely slows, muscle mass becomes harder to keep, and intensity is the first thing most athletes drop, which is exactly backwards.'],
      ['h2', 'The masters adjustments'],
      ['ul', [
        'Keep the intensity, space it out: the same interval sessions you did at 30, on a 10-day cycle instead of a 7-day one.',
        'Lift twice a week: strength work is no longer optional — it is the difference between slowing 5% and 12% per decade.',
        'Sleep is training: growth hormone release during deep sleep does the adaptation your workout only signals.',
        'Race shorter more often: frequent 5Ks hold speed better than occasional marathons, and produce more marked bests for the profile.',
      ]],
      ['h2', 'Chasing the percentage'],
      ['p', 'Set goals in age-graded terms: 60% is a solid club athlete, 70% is regional class, 80% is national class. A rising percentage in your 50s and 60s is a genuine, verifiable athletic achievement — often more impressive than any open-age PR on your board.'],
    ],
    links: [
      ['parkrun age-grading explained', 'https://support.parkrun.com/hc/en-us/articles/200565263-4-5-Age-grading'],
      ['U.S. Masters Swimming — age grading', 'https://www.usms.org/fitness-and-training'],
      ['World Masters Athletics', 'https://world-masters-athletics.org/'],
    ],
  },
];

export function getArticle(slug) {
  return ARTICLES.find((a) => a.slug === slug) ?? null;
}
