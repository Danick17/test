import db from './db.js';
import { EVENTS, toSeconds } from './score.js';

// Applies an official result to an athlete's PR board. An official time
// becomes the marked PR when it beats the current best, or when the current
// best is only self-reported ("logged") — official always outranks logged.
export function applyOfficialPr(athleteId, event, timeDisplay, seconds) {
  const existing = db.prepare(
    'SELECT id, time_seconds, verified FROM prs WHERE athlete_id = ? AND event = ?').get(athleteId, event);
  if (!existing) {
    db.prepare(`INSERT INTO prs (athlete_id, event, time_display, time_seconds, verified)
                VALUES (?, ?, ?, ?, 1)`).run(athleteId, event, timeDisplay, seconds);
    return true;
  }
  if (seconds < existing.time_seconds || !existing.verified) {
    // Keep the faster time; an official-but-slower time only replaces a logged one.
    const better = seconds < existing.time_seconds;
    db.prepare('UPDATE prs SET time_display = ?, time_seconds = ?, verified = 1 WHERE id = ?')
      .run(better ? timeDisplay : (existing.verified ? existing.time_display : timeDisplay),
           better ? seconds : (existing.verified ? existing.time_seconds : seconds),
           existing.id);
    return true;
  }
  return false;
}

// Ingests one official race with its finish list, as delivered by a timing
// partner. Finishers whose name exactly matches a registered athlete are
// attached and their PRs marked automatically; everyone else stays unclaimed
// until they claim the row from the race page.
export function ingestRace({ name, event, date, location = '', results = [] }) {
  if (!EVENTS[event]) throw new Error(`Unknown event "${event}"`);
  if (!name || !date) throw new Error('Race name and date are required');

  const run = db.transaction(() => {
    const existing = db.prepare('SELECT id FROM races WHERE name = ? AND date = ?').get(name, date);
    if (existing) return { raceId: existing.id, skipped: true, inserted: 0, matched: 0 };

    const { lastInsertRowid: raceId } = db.prepare(
      'INSERT INTO races (name, event, date, location) VALUES (?, ?, ?, ?)').run(name, event, date, location);

    const findAthlete = db.prepare('SELECT id FROM athletes WHERE name = ? COLLATE NOCASE');
    const insResult = db.prepare(`
      INSERT INTO results (race_id, athlete_id, athlete_name, place, time_display, time_seconds)
      VALUES (?, ?, ?, ?, ?, ?)`);

    let inserted = 0;
    let matched = 0;
    const ranked = results
      .map((r) => ({ ...r, seconds: toSeconds(r.time) }))
      .filter((r) => r.name && r.seconds != null)
      .sort((a, b) => a.seconds - b.seconds);

    ranked.forEach((r, i) => {
      const athlete = findAthlete.get(r.name.trim());
      insResult.run(raceId, athlete?.id ?? null, r.name.trim(), r.place ?? i + 1, r.time.trim(), r.seconds);
      inserted += 1;
      if (athlete) {
        applyOfficialPr(athlete.id, event, r.time.trim(), r.seconds);
        matched += 1;
      }
    });
    return { raceId, skipped: false, inserted, matched };
  });
  return run();
}

// A logged-in athlete claims an unclaimed finish-line row as their own.
export function claimResult(resultId, athleteId) {
  const row = db.prepare(`
    SELECT r.id, r.athlete_id, r.time_display, r.time_seconds, races.event
    FROM results r JOIN races ON races.id = r.race_id WHERE r.id = ?`).get(resultId);
  if (!row) return { error: 'Result not found.', status: 404 };
  if (row.athlete_id) return { error: 'This result is already claimed.', status: 409 };
  db.prepare('UPDATE results SET athlete_id = ? WHERE id = ?').run(athleteId, resultId);
  applyOfficialPr(athleteId, row.event, row.time_display, row.time_seconds);
  return { ok: true };
}

export function raceHistory(athleteId) {
  return db.prepare(`
    SELECT races.id AS race_id, races.name, races.date, races.event, races.location,
           r.place, r.time_display
    FROM results r JOIN races ON races.id = r.race_id
    WHERE r.athlete_id = ? ORDER BY races.date DESC`).all(athleteId);
}

// Seed two official races on first run so the results section demos itself.
if (db.prepare('SELECT COUNT(*) AS n FROM races').get().n === 0) {
  ingestRace({
    name: 'Riverside City 10K', event: '10K Run', date: '2026-06-14', location: 'Portland, USA',
    results: [
      { name: 'Sofia Almeida', time: '34:59' },
      { name: 'Fatima Zahra', time: '36:48' },
      { name: 'Liam O\'Connor', time: '38:20' },
      { name: 'Jonas Weber', time: '39:05' },
      { name: 'Priya Nair', time: '41:32' },
      { name: 'Raj Patel', time: '43:37' },
      { name: 'Emma Lindström', time: '44:10' },
      { name: 'Carlos Mendes', time: '47:58' },
    ],
  });
  ingestRace({
    name: 'Lakeside Sprint Triathlon', event: 'Sprint Tri', date: '2026-05-24', location: 'Geneva, Switzerland',
    results: [
      { name: 'Tomás Ortega', time: '1:07:12' },
      { name: 'Maya Chen', time: '1:12:40' },
      { name: 'Nina Petrova', time: '1:15:03' },
      { name: 'David Okafor', time: '1:18:44' },
      { name: 'Lucie Bernard', time: '1:21:09' },
    ],
  });
}
