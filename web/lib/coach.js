import { EVENTS, scoreOf } from './score.js';
import { ARTICLES } from './articles.js';

export function formatPace(secPerKm) {
  const m = Math.floor(secPerKm / 60);
  const s = Math.round(secPerKm % 60);
  return `${m}:${String(s).padStart(2, '0')}/km`;
}

export function formatTime(secs) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = Math.round(secs % 60);
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${m}:${String(s).padStart(2, '0')}`;
}

const RUN_KM = { '5K Run': 5, '10K Run': 10, 'Half Marathon': 21.0975, 'Marathon': 42.195 };
const SWIM_M = { '100m Free': 100, '400m Free': 400, '1500m Free': 1500 };

// Riegel's formula: predicted time at a new distance from a known performance.
const riegel = (secs, fromKm, toKm) => secs * Math.pow(toKm / fromKm, 1.06);

function bestRunPr(prs) {
  return prs
    .filter((p) => RUN_KM[p.event])
    .sort((a, b) => (scoreOf(b.event, b.time_seconds) ?? 0) - (scoreOf(a.event, a.time_seconds) ?? 0))[0] ?? null;
}

// Builds the athlete-context block shared by the Claude system prompt and the
// built-in coach.
export function athleteContext(athlete, prs) {
  if (!athlete) return 'The user is not logged in; give general advice and suggest creating a profile.';
  const lines = prs.map((p) => {
    const sc = scoreOf(p.event, p.time_seconds);
    return `- ${p.event}: ${p.time_display}${sc != null ? ` (Bestmark Score ${sc.toFixed(1)}/100)` : ''}${p.verified ? ' [verified]' : ' [self-reported]'}`;
  });
  return [
    `Athlete: ${athlete.name} (@${athlete.handle}), age ${athlete.age}, sports: ${athlete.sports}.`,
    prs.length ? `Personal records:\n${lines.join('\n')}` : 'No personal records logged yet.',
  ].join('\n');
}

export function coachSystemPrompt(athlete, prs) {
  const articleList = ARTICLES.map((a) => `- "${a.title}" at /articles/${a.slug} (${a.sport})`).join('\n');
  return `You are the Bestmark Coach, an endurance-sports coach inside Bestmark — a site where runners, swimmers, cyclists, and triathletes track verified personal records.

Voice: precise, warm, data-honest. Lead with the number, follow with the meaning. Never use phrases like "crushed it" or "beast mode". Encourage every level of athlete equally.

Guidelines:
- Give specific, actionable training advice grounded in the athlete's actual PRs below. Derive training paces from their race times when relevant.
- Follow the 80/20 principle: most volume easy, one or two quality sessions a week. Warn against adding volume and intensity simultaneously.
- You are not a medical professional; for pain or injury concerns, recommend seeing a physiotherapist or doctor rather than diagnosing.
- Keep answers concise (usually under 250 words) and end with one concrete next step.
- When an on-site article covers the topic, link it by path. Available articles:
${articleList}

${athleteContext(athlete, prs)}`;
}

/* ---------------------------------------------------------------------------
 * Built-in coach: a topic-aware rule engine that computes real numbers from
 * the athlete's PRs. Used when the server has no Anthropic credentials; the
 * Claude-powered coach takes over automatically once ANTHROPIC_API_KEY is set.
 * ------------------------------------------------------------------------- */

const NO_PR_NUDGE = 'Add a personal record to your profile (or claim an official result under Results) and my numbers get personal.';

function pacesBlock(run) {
  const rp = run.time_seconds / RUN_KM[run.event];
  return [
    `From your ${run.event} best of ${run.time_display} (race pace ${formatPace(rp)}):`,
    `• Easy / recovery: ${formatPace(rp * 1.35)}–${formatPace(rp * 1.2)} — most of your weekly volume lives here`,
    `• Long run: about ${formatPace(rp * 1.25)}`,
    `• Tempo / threshold: ${formatPace(rp * 1.09)}–${formatPace(rp * 1.06)}, 20–30 min continuous`,
    `• Intervals (VO2max): ${formatPace(rp * 0.95)}–${formatPace(rp * 0.98)} in reps of 2–5 min, equal jog recovery`,
  ].join('\n');
}

function predictionsBlock(run) {
  const fromKm = RUN_KM[run.event];
  const rows = Object.entries(RUN_KM)
    .filter(([ev]) => ev !== run.event)
    .map(([ev, km]) => `• ${ev}: ~${formatTime(riegel(run.time_seconds, fromKm, km))}`);
  return [
    `Based on your ${run.event} of ${run.time_display}, equivalent performances (Riegel formula) are:`,
    ...rows,
    'Longer distances assume the endurance base is there — the marathon prediction only holds with consistent 50+ km weeks.',
  ].join('\n');
}

function weeklyPlanBlock(athlete, run) {
  const sports = (athlete?.sports ?? 'run').split(',');
  const lines = ['A balanced week (adjust days to your life — the order matters more than the weekday):'];
  if (sports.includes('run') || run) {
    lines.push(
      '• Tue — intervals: 5–6 × 800m at 5K effort, 2–3 min jog between',
      '• Thu — tempo: 20 min comfortably hard',
      '• Sun — long easy run, fully conversational',
      '• Everything else easy or rest. 80% of weekly volume should feel easy.');
  }
  if (sports.includes('swim')) lines.push('• Swim: one technique session (drills + stroke counting) and one endurance set per week — see /articles/swim-faster-technique.');
  if (sports.includes('bike')) lines.push('• Bike: 2×20 min sweet spot (88–94% FTP) once a week is the reliable engine-builder — see /articles/raise-your-ftp.');
  if (sports.includes('tri')) lines.push('• Tri: one brick weekly (ride + short run off the bike) — see /articles/triathlon-brick-workouts.');
  lines.push('Progress one variable at a time: add reps, then shorten recoveries, then raise pace — never all three in the same week.');
  return lines.join('\n');
}

function racePacingBlock(run) {
  const rp = run.time_seconds / RUN_KM[run.event];
  return [
    `Pacing plan for your next ${run.event} (goal: beat ${run.time_display}):`,
    `• First 1–2 km: ${formatPace(rp + 3)} — deliberately 2–3 s/km slower than goal. Nearly every PR is negative-split.`,
    `• Middle: lock onto ${formatPace(rp)} and stay boring.`,
    `• Final quarter: this is the only part of a race where "push" is the right instruction.`,
    'If you reach halfway feeling heroic, you started too fast — hold, don\'t surge.',
  ].join('\n');
}

function swimBlock(prs) {
  const swims = prs.filter((p) => SWIM_M[p.event]);
  const lines = [];
  if (swims.length) {
    for (const s of swims) {
      const per100 = s.time_seconds / (SWIM_M[s.event] / 100);
      lines.push(`• ${s.event}: ${s.time_display} = ${formatTime(per100)} per 100m`);
    }
    lines.push('CSS (threshold) pace sits between your 400 and 1500 per-100 splits — aim intervals there.');
  }
  lines.push('Swimming rewards technique over fitness: one drill session a week (25 drill / 25 swim × 8) beats an extra hard set. Full guide: /articles/swim-faster-technique — and for racing outdoors, /articles/open-water-confidence.');
  return lines.join('\n');
}

function bikeBlock(prs) {
  const tt = prs.find((p) => p.event === '40K Bike TT');
  const lines = [];
  if (tt) {
    const kmh = 40 / (tt.time_seconds / 3600);
    lines.push(`Your 40K TT of ${tt.time_display} is ${kmh.toFixed(1)} km/h — that ride is essentially an FTP test with aerodynamics.`);
  }
  lines.push('The engine-builder is sweet spot: 2×20 min at 88–94% of FTP, twice a week, everything else genuinely easy. Retest every 6–8 weeks (20-min best effort × 0.95). Full guide: /articles/raise-your-ftp.');
  return lines.join('\n');
}

function triBlock() {
  return 'The cheapest time in triathlon is the run off the bike: one brick a week (ride with the last 20 min at race effort + 15 min run starting at race pace) typically buys 60–90 s in an Olympic. Spin an easier gear at 95+ rpm for the final 5 min of the ride, and start every brick run deliberately slow for 400m. Full progression: /articles/triathlon-brick-workouts.';
}

export function fallbackCoachReply(athlete, prs, userMessage) {
  const q = (userMessage ?? '').toLowerCase();
  const run = bestRunPr(prs);
  const has = (re) => re.test(q);
  const parts = [];

  if (has(/injur|pain|hurt|shin|knee|achilles|plantar|stress fracture/)) {
    parts.push("Pain that changes how you move, lasts more than a few days, or worsens during a run is a stop sign — please see a physiotherapist or sports doctor rather than training through it. I'm a coach, not a clinician.",
      'While you sort it out: keep fitness with whatever is pain-free (often swimming or easy cycling), and when you return, restart at ~60% of previous volume and rebuild by no more than 10% a week.');
  } else if (has(/taper/)) {
    parts.push('Taper rule of thumb: cut volume ~40% in the final two weeks but keep one short, sharp session (4 × 400m at goal pace) so the legs stay lively. Fitness is banked in the weeks before — the taper only unwraps it.');
  } else if (has(/predict|can i (run|do|go)|sub[- ]?\d|equivalent|what could i/) && run) {
    parts.push(predictionsBlock(run));
  } else if (has(/week|plan|schedule|program|structure/)) {
    parts.push(weeklyPlanBlock(athlete, run));
    if (run) parts.push(pacesBlock(run));
  } else if (has(/strategy|split|pacing|pace (the|my|a) race|race day|negative/) && run) {
    parts.push(racePacingBlock(run));
    parts.push('Fueling matters from 90 minutes up: /articles/race-day-fueling.');
  } else if (has(/swim|stroke|freestyle|open water|buoy/)) {
    parts.push(swimBlock(prs));
  } else if (has(/bike|cycling|ftp|watt|time trial|\btt\b/)) {
    parts.push(bikeBlock(prs));
  } else if (has(/\btri\b|triathlon|brick|transition|ironman|70\.3/)) {
    parts.push(triBlock());
  } else if (has(/strength|gym|lift|weights/)) {
    parts.push('Two short strength sessions a week (squat, hinge, calf raises, core — heavy, low reps) make endurance athletes faster and far more durable, especially past 40. Guide: /articles/strength-training-endurance.');
  } else if (has(/plateau|stuck|motivat|bored|not improving/)) {
    parts.push('Plateaus usually mean one of three things: easy days too hard (check: can you hold a conversation?), the same stimulus repeated for months (rotate the interval menu), or a missing goal. Pick a race 8–10 weeks out, find a rival near your score on the Leaderboards, and train at them.');
  } else if (has(/pace|easy|tempo|threshold|interval|zone/) && run) {
    parts.push(pacesBlock(run));
  } else if (run) {
    parts.push(`You're working from a ${run.event} best of ${run.time_display} (score ${scoreOf(run.event, run.time_seconds)?.toFixed(1)}/100). I can turn that into training paces, a weekly plan, race predictions, or a pacing strategy — ask for any of those.`,
      pacesBlock(run));
  } else if (prs.length) {
    parts.push(`You have ${prs.length} marked best${prs.length > 1 ? 's' : ''} on your profile. Ask me for a weekly plan, or about swim technique, FTP, or bricks — I'll build from what's on your board.`);
  } else {
    parts.push('A good week is simple: one interval day, one threshold day, everything else genuinely easy — the 80/20 rule.', NO_PR_NUDGE);
  }

  // One concrete next step.
  if (run && !has(/injur|pain/)) {
    parts.push(`Next step: this week, run one 20-minute tempo at ${formatPace((run.time_seconds / RUN_KM[run.event]) * 1.07)} and log how it felt.`);
  } else if (!prs.length) {
    parts.push('Next step: add your most recent race time to your profile.');
  }
  return parts.join('\n\n');
}

export function knownEvents() {
  return Object.keys(EVENTS);
}
