import Link from 'next/link';
import { notFound } from 'next/navigation';
import db from '@/lib/db';
import '@/lib/results';
import { scoreOf } from '@/lib/score';
import { currentAthlete } from '@/lib/auth';
import ClaimButton from './claim-button';

export const dynamic = 'force-dynamic';
const MEDALS = ['🥇', '🥈', '🥉'];

export default async function RacePage({ params }) {
  const { id } = await params;
  const race = db.prepare('SELECT * FROM races WHERE id = ?').get(Number(id));
  if (!race) notFound();

  const rows = db.prepare(`
    SELECT r.id, r.athlete_id, r.athlete_name, r.place, r.time_display, r.time_seconds, a.handle
    FROM results r LEFT JOIN athletes a ON a.id = r.athlete_id
    WHERE r.race_id = ? ORDER BY r.place ASC`).all(race.id);
  const me = await currentAthlete();

  return (
    <main className="wrap" style={{ maxWidth: 820 }}>
      <section style={{ padding: '40px 0 8px' }}>
        <div className="tags"><span className="tag" style={{ background: 'var(--green)' }}>OFFICIAL RESULTS</span></div>
        <h1 style={{ letterSpacing: '-.02em', margin: '10px 0 4px' }}>{race.name}</h1>
        <div className="meta">{race.event} · {race.date} · {race.location || '—'}</div>
      </section>

      <table className="prtable">
        <thead><tr><th>Place</th><th>Athlete</th><th>Time</th><th style={{ textAlign: 'right' }}>Score</th><th></th></tr></thead>
        <tbody>
          {rows.map((r) => {
            const sc = scoreOf(race.event, r.time_seconds);
            return (
              <tr key={r.id}>
                <td style={{ fontFamily: 'var(--mono)', fontWeight: 600 }}>{MEDALS[r.place - 1] ?? `#${r.place}`}</td>
                <td>
                  {r.handle ? (
                    <Link href={`/athletes/${r.handle}`} style={{ fontWeight: 600 }}>
                      {r.athlete_name} <span className="mark">✓ marked</span>
                    </Link>
                  ) : (
                    <>{r.athlete_name} <span className="logged">unclaimed</span></>
                  )}
                </td>
                <td className="time">{r.time_display}</td>
                <td className="sc">{sc == null ? '—' : sc.toFixed(1)}</td>
                <td style={{ textAlign: 'right' }}>
                  {!r.handle && (me
                    ? <ClaimButton resultId={r.id} />
                    : <Link href="/login" className="chip" style={{ textDecoration: 'none' }}>Log in to claim</Link>)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p style={{ color: 'var(--slate)', fontSize: 13, margin: '14px 0 60px' }}>
        Claiming attaches this official finish to your profile and marks your PR with the ✓. Claim only your own results.
      </p>
    </main>
  );
}
