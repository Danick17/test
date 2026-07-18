import Link from 'next/link';
import db from '@/lib/db';
import '@/lib/results'; // ensures race seeding has run

export const dynamic = 'force-dynamic';

export default async function ResultsPage() {
  const races = db.prepare(`
    SELECT races.*, COUNT(r.id) AS finishers,
           SUM(CASE WHEN r.athlete_id IS NULL THEN 1 ELSE 0 END) AS unclaimed
    FROM races LEFT JOIN results r ON r.race_id = races.id
    GROUP BY races.id ORDER BY races.date DESC`).all();

  return (
    <main className="wrap">
      <section className="hero" style={{ padding: '48px 0 20px' }}>
        <h1>Official results. <em>Straight from the finish line.</em></h1>
        <p>Timed competition results, ingested from race organizers. Find your race, claim your row, and your PR gets the ✓ mark.</p>
      </section>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
        {races.map((r) => (
          <Link className="card" key={r.id} href={`/results/${r.id}`}>
            <div className="tags"><span className="tag" style={{ background: 'var(--green)' }}>OFFICIAL</span></div>
            <h3>{r.name}</h3>
            <div className="meta">{r.event} · {r.date} · {r.location || '—'}</div>
            <div className="bestrow"><span>Finishers</span><span className="t">{r.finishers}</span></div>
            <div className="bestrow"><span>Unclaimed results</span><span className="t">{r.unclaimed}</span></div>
          </Link>
        ))}
      </div>
      <p style={{ color: 'var(--slate)', fontSize: 13, margin: '10px 0 60px' }}>
        Race director or timing company? Results are ingested via the import API — see the repository README.
      </p>
    </main>
  );
}
