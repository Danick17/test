import { notFound } from 'next/navigation';
import db from '@/lib/db';
import { bestScore, scoreOf } from '@/lib/score';
import { currentAthlete } from '@/lib/auth';
import AddPrForm from './add-pr-form';
import ProfileActions from './profile-actions';

export const dynamic = 'force-dynamic';

export default async function AthletePage({ params }) {
  const { handle } = await params;
  const athlete = db.prepare(
    'SELECT id, handle, name, age, country, sports, verified FROM athletes WHERE handle = ? COLLATE NOCASE'
  ).get(handle);
  if (!athlete) notFound();

  const prs = db.prepare(
    'SELECT event, time_display, time_seconds, verified FROM prs WHERE athlete_id = ? ORDER BY id'
  ).all(athlete.id);
  const me = await currentAthlete();
  const isOwner = me?.id === athlete.id;
  const followers = db.prepare('SELECT COUNT(*) AS n FROM follows WHERE athlete_id = ?').get(athlete.id).n;
  const isFollowing = me
    ? Boolean(db.prepare('SELECT 1 FROM follows WHERE follower_id = ? AND athlete_id = ?').get(me.id, athlete.id))
    : false;
  const topPr = prs
    .map((p) => ({ ...p, score: scoreOf(p.event, p.time_seconds) }))
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))[0];

  return (
    <main className="wrap">
      <div className="profile-head">
        <div>
          <h2>{athlete.name} {athlete.verified ? <span className="mark">✓</span> : null}</h2>
          <div className="handle">bestmark.com/@{athlete.handle} · {athlete.age} · {athlete.country || '—'}</div>
          <div className="tags" style={{ marginTop: 10 }}>
            {athlete.sports.split(',').map((s) => <span key={s} className={`tag t-${s}`}>{s.toUpperCase()}</span>)}
          </div>
        </div>
        <div className="score"><b>{bestScore(prs).toFixed(1)}</b><span>BEST SCORE</span></div>
      </div>

      <ProfileActions
        handle={athlete.handle}
        name={athlete.name}
        isOwner={isOwner}
        loggedIn={Boolean(me)}
        initialFollowing={isFollowing}
        initialFollowers={followers}
        bestPr={topPr ? { event: topPr.event, time: topPr.time_display, score: topPr.score } : null}
      />

      <table className="prtable">
        <thead>
          <tr><th>Event</th><th>Best</th><th style={{ textAlign: 'right' }}>Score</th></tr>
        </thead>
        <tbody>
          {prs.length === 0 && (
            <tr><td colSpan={3} style={{ color: 'var(--slate)' }}>No personal records yet.</td></tr>
          )}
          {prs.map((p) => {
            const sc = scoreOf(p.event, p.time_seconds);
            return (
              <tr key={p.event}>
                <td>{p.event}{' '}
                  {p.verified ? <span className="mark">✓ marked</span> : <span className="logged">logged</span>}
                </td>
                <td className="time">{p.time_display}</td>
                <td className="sc">{sc == null ? '—' : sc.toFixed(1)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {isOwner && <AddPrForm />}
    </main>
  );
}
