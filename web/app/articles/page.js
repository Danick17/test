import Link from 'next/link';
import { ARTICLES } from '@/lib/articles';

export const metadata = { title: 'Training Hub — Bestmark' };

export default async function ArticlesPage({ searchParams }) {
  const { sport = 'all' } = await searchParams;
  const list = ARTICLES.filter((a) => sport === 'all' || a.sport === sport);

  return (
    <main className="wrap">
      <section className="hero" style={{ padding: '48px 0 24px' }}>
        <h1>Train smarter. <em>Mark faster.</em></h1>
        <p>Guides on raising your PRs across running, swimming, cycling, and triathlon — plus where to read more.</p>
      </section>

      <form className="controls" method="GET">
        {['all', 'run', 'swim', 'bike', 'tri'].map((s) => (
          <button key={s} className={`chip${sport === s ? ' on' : ''}`} name="sport" value={s}>
            {s === 'all' ? 'All' : s[0].toUpperCase() + s.slice(1)}
          </button>
        ))}
      </form>

      <div className="grid">
        {list.map((a) => (
          <Link className="card" key={a.slug} href={`/articles/${a.slug}`}>
            <div className="tags"><span className={`tag t-${a.sport}`}>{a.sport.toUpperCase()}</span></div>
            <h3>{a.title}</h3>
            <div className="meta">{a.minutes} min read</div>
            <p style={{ fontSize: 14, color: '#9fb2c2' }}>{a.teaser}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
