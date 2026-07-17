import Link from 'next/link';
import db from '@/lib/db';
import { bestScore, SPORTS } from '@/lib/score';

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }) {
  const { q = '', sport = 'all' } = await searchParams;

  let athletes = db.prepare(`
    SELECT a.id, a.handle, a.name, a.age, a.country, a.sports, a.verified
    FROM athletes a`).all();

  const query = q.trim().toLowerCase();
  if (query) {
    athletes = athletes.filter(
      (a) => a.name.toLowerCase().includes(query) || a.handle.toLowerCase().includes(query));
  }
  if (sport !== 'all') athletes = athletes.filter((a) => a.sports.split(',').includes(sport));

  const prsFor = db.prepare(
    'SELECT event, time_display, time_seconds, verified FROM prs WHERE athlete_id = ? ORDER BY id');
  const rows = athletes
    .map((a) => ({ ...a, prs: prsFor.all(a.id) }))
    .map((a) => ({ ...a, score: bestScore(a.prs) }))
    .sort((x, y) => y.score - x.score);

  return (
    <>
      <section className="hero wrap">
        <h1>Every best. <em>On the record.</em></h1>
        <p>One profile for all your personal records — running, swimming, cycling, and triathlon.
           Sign up, post your bests, and see how every athlete stacks up.</p>
      </section>

      <main className="wrap">
        <form className="controls" method="GET">
          <input type="search" name="q" defaultValue={q} placeholder="Search athletes by name or handle…" />
          {['all', ...SPORTS].map((s) => (
            <button key={s} className={`chip${sport === s ? ' on' : ''}`} name="sport" value={s}>
              {s === 'all' ? 'All' : s[0].toUpperCase() + s.slice(1)}
            </button>
          ))}
        </form>

        <div className="grid">
          {rows.length === 0 && <p style={{ color: 'var(--slate)' }}>No athletes match.</p>}
          {rows.map((a) => (
            <Link className="card" key={a.id} href={`/athletes/${a.handle}`}>
              <span className="score"><b>{a.score.toFixed(1)}</b><span>BEST SCORE</span></span>
              <h3>{a.name} {a.verified ? <span className="mark">✓</span> : null}</h3>
              <div className="handle">@{a.handle}</div>
              <div className="meta">{a.age} · {a.country || '—'}</div>
              <div className="tags">
                {a.sports.split(',').map((s) => <span key={s} className={`tag t-${s}`}>{s.toUpperCase()}</span>)}
              </div>
              {a.prs.slice(0, 3).map((p) => (
                <div className="bestrow" key={p.event}>
                  <span>{p.event}</span><span className="t">{p.time_display}</span>
                </div>
              ))}
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
