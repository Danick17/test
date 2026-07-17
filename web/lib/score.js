// Demo Bestmark Score: benchmark-relative (strong open-class reference time
// divided by the athlete's time, as a percentage, capped at 100). The
// production methodology (WMA/USMS age-graded tables) is specified in
// product/product-outline.md.
export const EVENTS = {
  '5K Run':        { sport: 'run',  ref: 755 },
  '10K Run':       { sport: 'run',  ref: 1571 },
  'Half Marathon': { sport: 'run',  ref: 3444 },
  'Marathon':      { sport: 'run',  ref: 7235 },
  '100m Free':     { sport: 'swim', ref: 47 },
  '400m Free':     { sport: 'swim', ref: 220 },
  '1500m Free':    { sport: 'swim', ref: 871 },
  '40K Bike TT':   { sport: 'bike', ref: 2880 },
  'Sprint Tri':    { sport: 'tri',  ref: 3300 },
  'Olympic Tri':   { sport: 'tri',  ref: 6180 },
  'Ironman 70.3':  { sport: 'tri',  ref: 13560 },
};

export const SPORTS = ['run', 'swim', 'bike', 'tri'];

export function toSeconds(t) {
  const parts = String(t).trim().split(':');
  if (!parts.length || parts.length > 3) return null;
  const nums = parts.map(Number);
  if (nums.some((n) => Number.isNaN(n) || n < 0)) return null;
  const s = nums.reduce((acc, v) => acc * 60 + v, 0);
  return s > 0 ? s : null;
}

export function scoreOf(event, seconds) {
  const e = EVENTS[event];
  if (!e || !seconds) return null;
  return Math.min(100, Math.round((e.ref / seconds) * 1000) / 10);
}

export function bestScore(prs) {
  const scores = prs.map((p) => scoreOf(p.event, p.time_seconds)).filter((s) => s != null);
  return scores.length ? Math.max(...scores) : 0;
}
