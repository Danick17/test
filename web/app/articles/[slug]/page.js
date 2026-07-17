import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticle } from '@/lib/articles';

export const dynamic = 'force-dynamic';

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <main className="wrap" style={{ maxWidth: 720 }}>
      <article style={{ padding: '40px 0 60px' }}>
        <div className="tags"><span className={`tag t-${article.sport}`}>{article.sport.toUpperCase()}</span></div>
        <h1 style={{ letterSpacing: '-.02em', margin: '10px 0 4px' }}>{article.title}</h1>
        <div className="meta">{article.minutes} min read · Bestmark Training Hub</div>

        {article.blocks.map(([type, content], i) => {
          if (type === 'h2') return <h2 key={i} style={{ margin: '28px 0 10px', letterSpacing: '-.01em' }}>{content}</h2>;
          if (type === 'ul') return (
            <ul key={i} style={{ margin: '12px 0 12px 22px', color: '#c9d6e0' }}>
              {content.map((li, j) => <li key={j} style={{ marginBottom: 8 }}>{li}</li>)}
            </ul>
          );
          return <p key={i} style={{ margin: '14px 0', color: '#c9d6e0' }}>{content}</p>;
        })}

        <h2 style={{ margin: '32px 0 10px' }}>Read more elsewhere</h2>
        <ul style={{ margin: '0 0 24px 22px' }}>
          {article.links.map(([label, url]) => (
            <li key={url} style={{ marginBottom: 8 }}>
              <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--green)' }}>{label} ↗</a>
            </li>
          ))}
        </ul>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, display: 'flex', gap: 12 }}>
          <Link className="btn ghost" href="/articles">← All articles</Link>
          <Link className="btn" href="/coach">Ask the AI coach about this</Link>
        </div>
      </article>
    </main>
  );
}
