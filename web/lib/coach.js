import { EVENTS, scoreOf } from './score.js';
import { ARTICLES } from './articles.js';

export function formatPace(secPerKm) {
  const m = Math.floor(secPerKm / 60);
  const s = Math.round(secPerKm % 60);
  return `${m}:${String(s).padStart(2, '0')}/km`;
}

const EVENT_KM = {
  '5K Run': 5, '10K Run': 10, 'Half Marathon': 21.0975, 'Marathon': 42.195,
};

// Builds the athlete-context block shared by the Claude system prompt and the
// offline fallback coach.
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

// Deterministic offline coach used when the Claude API is unavailable.
// Derives training paces from the athlete's best running PR and gives a
// sport-appropriate weekly structure.
export function fallbackCoachReply(athlete, prs, userMessage) {
  const out = [];
  const runPr = prs
    .filter((p) => EVENT_KM[p.event])
    .sort((a, b) => (scoreOf(b.event, b.time_seconds) ?? 0) - (scoreOf(a.event, a.time_seconds) ?? 0))[0];

  if (athlete && runPr) {
    const racePace = runPr.time_seconds / EVENT_KM[runPr.event];
    out.push(
      `Based on your ${runPr.event} best of ${runPr.time_display}, your race pace is about ${formatPace(racePace)}. Training paces to work from:`,
      `• Easy runs: ${formatPace(racePace * 1.3)}–${formatPace(racePace * 1.2)} (most of your weekly volume)`,
      `• Tempo/threshold: around ${formatPace(racePace * 1.08)} for 20 minutes continuous`,
      `• Intervals: ${formatPace(racePace * 0.97)} in reps of 2–5 minutes with equal jog recovery`,
    );
  } else if (athlete && prs.length) {
    out.push(`You have ${prs.length} marked best${prs.length > 1 ? 's' : ''} on your profile. A good week pairs one interval session and one threshold session with mostly easy volume — the 80/20 rule.`);
  } else {
    out.push('Add a personal record to your profile and I can derive your training paces from it. In general: one interval day, one threshold day, everything else genuinely easy.');
  }

  const sports = (athlete?.sports ?? '').split(',');
  if (sports.includes('swim')) out.push('For swimming, technique beats fitness: see "Swim Faster Without Getting Fitter" in /articles.');
  if (sports.includes('bike')) out.push('For the bike, sweet-spot work (2×20 min at 88–94% FTP) is the reliable engine-builder: see "Raising Your FTP" in /articles.');
  if (sports.includes('tri')) out.push('For triathlon, weekly brick sessions fix the run-off-the-bike problem: see "Brick Workouts" in /articles.');

  out.push('(The full AI coach is offline right now — this is a quick plan computed from your profile. An administrator can enable the AI coach by setting the ANTHROPIC_API_KEY environment variable.)');
  return out.join('\n\n');
}

export function knownEvents() {
  return Object.keys(EVENTS);
}
