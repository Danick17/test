import Link from 'next/link';
import db from '@/lib/db';
import { bestScore, scoreOf } from '@/lib/score';

export const dynamic = 'force-dynamic';

function loadAthlete(handle) {
  if (!handle) return null;
  const a = db.prepare(
    'SELECT id, handle, name, age, country, sports, verified FROM athletes WHERE handle = ? COLLATE NOCASE').get(handle);
  if (!a) return null;
  a.prs = db.prepare('SELECT event, time_display, time_seconds FROM prs WHERE athlete_id = ? ORDER BY id').all(a.id);
  return a;
}

function Card({ a, won }) {
  return (
    <div className="card" style={{ cursor: 'default', textAlign: 'center', borderColor: won ? 'var(--green)' : undefined }}>
      <h3><Link href={`/athletes/${a.handle}`}>{a.name}</Link> {a.verified ? <span className="mark">✓</span> : null}</h3>
      <div className="handle">@{a.handle} · {a.age} · {a.country || '—'}</div>
      <div style={{ font: '700 44px/1.3 var(--mono)', color: 'var(--gold)' }}>{bestScore(a.prs).toFixed(1)}</div>
      <div style={{ fontSize: 11, letterSpacing: '.25em', color: 'var(--slate)' }}>BEST SCORE</div>
    </div>
  );
}

export default async function ComparePage({ searchParams }) {
  const { a: ha = '', b: hb = '' } = await searchParams;
  const A = loadAthlete(ha);
  const B = loadAthlete(hb);
  const handles = db.prepare('SELECT handle FROM athletes ORDER BY handle').all().map((r) => r.handle);

  let common = [];
  if (A && B) {
    const bMap = new Map(B.prs.map((p) => [p.event, p]));
    common = A.prs.filter((p) => bMap.has(p.event)).map((p) => [p, bMap.get(p.event)]);
  }
  const aWins = common.filter(([pa, pb]) => pa.time_seconds < pb.time_seconds).length;
  const bWins = common.filter(([pa, pb]) => pb.time_seconds < pa.time_seconds).length;

  return (
    <main className="wrap" style={{ maxWidth: 860 }}>
      <section className="hero" style={{ padding: '48px 0 20px' }}>
        <h1>Head to head. <em>Settle it.</em></h1>
        <p>Pick any two athletes and compare every shared event, score to score.</p>
      </section>

      <form className="controls" method="GET" style={{ justifyContent: 'center' }}>
        <input list="handles" name="a" defaultValue={ha} placeholder="first handle…" style={{ flex: 'none', width: 220, background: 'var(--ink2)', border: '1px solid var(--border2)', borderRadius: 8, padding: '10px 14px', color: 'var(--paper)', font: 'inherit' }} />
        <span style={{ color: 'var(--slate)', fontWeight: 700 }}>VS</span>
        <input list="handles" name="b" defaultValue={hb} placeholder="second handle…" style={{ flex: 'none', width: 220, background: 'var(--ink2)', border: '1px solid var(--border2)', borderRadius: 8, padding: '10px 14px', color: 'var(--paper)', font: 'inherit' }} />
        <datalist id="handles">{handles.map((h) => <option key={h} value={h} />)}</datalist>
        <button className="btn">Compare</button>
      </form>

      {(ha || hb) && (!A || !B) && (
        <p style={{ textAlign: 'center', color: 'var(--run)' }}>
          {!A && ha ? `No athlete @${ha}. ` : ''}{!B && hb ? `No athlete @${hb}.` : 'Pick two handles to compare.'}
        </p>
      )}

      {A && B && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 20, alignItems: 'center', margin: '20px 0' }}>
            <Card a={A} won={aWins > bWins} />
            <div style={{ font: '700 26px/1 var(--mono)', color: 'var(--slate)', textAlign: 'center' }}>
              {common.length ? `${aWins}–${bWins}` : 'VS'}
              <div style={{ fontSize: 10, letterSpacing: '.2em', marginTop: 6 }}>{common.length ? 'HEAD TO HEAD' : ''}</div>
            </div>
            <Card a={B} won={bWins > aWins} />
          </div>

          <table className="prtable">
            <thead><tr><th>{A.name}</th><th style={{ textAlign: 'center' }}>Event</th><th style={{ textAlign: 'right' }}>{B.name}</th></tr></thead>
            <tbody>
              {common.length === 0 && (
                <tr><td colSpan={3} style={{ color: 'var(--slate)' }}>No shared events yet — scores above still compare them across sports.</td></tr>
              )}
              {common.map(([pa, pb]) => {
                const aFaster = pa.time_seconds < pb.time_seconds;
                return (
                  <tr key={pa.event}>
                    <td className="time" style={{ color: aFaster ? 'var(--green)' : undefined }}>
                      {pa.time_display} <span className="sc" style={{ float: 'none' }}>{scoreOf(pa.event, pa.time_seconds)?.toFixed(1)}</span>
                    </td>
                    <td style={{ textAlign: 'center', color: '#9fb2c2' }}>{pa.event}</td>
                    <td className="time" style={{ textAlign: 'right', color: !aFaster ? 'var(--green)' : undefined }}>
                      <span className="sc" style={{ float: 'none' }}>{scoreOf(pb.event, pb.time_seconds)?.toFixed(1)}</span> {pb.time_display}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </main>
  );
}
