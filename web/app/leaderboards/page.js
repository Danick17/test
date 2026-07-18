import Link from 'next/link';
import db from '@/lib/db';
import { EVENTS, scoreOf } from '@/lib/score';

export const dynamic = 'force-dynamic';
const MEDALS = ['🥇', '🥈', '🥉'];

export default async function LeaderboardsPage({ searchParams }) {
  const { event = '5K Run' } = await searchParams;
  const active = EVENTS[event] ? event : '5K Run';

  const rows = db.prepare(`
    SELECT a.handle, a.name, a.age, a.country, a.verified, p.time_display, p.time_seconds, p.verified AS pr_verified
    FROM prs p JOIN athletes a ON a.id = p.athlete_id
    WHERE p.event = ?
    ORDER BY p.time_seconds ASC`).all(active);

  return (
    <main className="wrap">
      <section className="hero" style={{ padding: '48px 0 20px' }}>
        <h1>Leaderboards. <em>Where do you stand?</em></h1>
        <p>Global rankings for every event. Add a PR to claim your spot.</p>
      </section>

      <form className="controls" method="GET" style={{ flexWrap: 'wrap' }}>
        {Object.keys(EVENTS).map((ev) => (
          <button key={ev} className={`chip${active === ev ? ' on' : ''}`} name="event" value={ev}>{ev}</button>
        ))}
      </form>

      <table className="prtable" style={{ maxWidth: 760, margin: '10px auto 60px' }}>
        <thead>
          <tr><th>Rank</th><th>Athlete</th><th>Time</th><th style={{ textAlign: 'right' }}>Score</th></tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr><td colSpan={4} style={{ color: 'var(--slate)' }}>
              No times for {active} yet — <Link href="/signup" style={{ color: 'var(--green)' }}>be the first on the board</Link>.
            </td></tr>
          )}
          {rows.map((r, i) => {
            const sc = scoreOf(active, r.time_seconds);
            return (
              <tr key={r.handle}>
                <td style={{ fontFamily: 'var(--mono)', fontWeight: 600 }}>{MEDALS[i] ?? `#${i + 1}`}</td>
                <td>
                  <Link href={`/athletes/${r.handle}`} style={{ fontWeight: 600 }}>
                    {r.name} {r.verified ? <span className="mark">✓</span> : null}
                  </Link>
                  <span className="handle"> @{r.handle} · {r.age} · {r.country || '—'}</span>
                  {!r.pr_verified && <span className="logged"> logged</span>}
                </td>
                <td className="time">{r.time_display}</td>
                <td className="sc">{sc == null ? '—' : sc.toFixed(1)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
