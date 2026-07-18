'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const NETWORKS = [
  { key: 'instagram', label: 'Instagram', url: (h) => `https://instagram.com/${h}`, color: '#E1306C',
    icon: 'M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9-.1-1.3-.1-1.6-.1-4.8s0-3.6.1-4.8C2.4 4 4 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zm0 3.7a6.1 6.1 0 100 12.2 6.1 6.1 0 000-12.2zm0 2.2a3.9 3.9 0 110 7.8 3.9 3.9 0 010-7.8zm6.4-3.8a1.4 1.4 0 100 2.9 1.4 1.4 0 000-2.9z' },
  { key: 'facebook', label: 'Facebook', url: (h) => `https://facebook.com/${h}`, color: '#1877F2',
    icon: 'M22 12a10 10 0 10-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0022 12z' },
  { key: 'tiktok', label: 'TikTok', url: (h) => `https://tiktok.com/@${h}`, color: '#8ef2ec',
    icon: 'M16.6 3c.4 2 1.7 3.4 3.7 3.6v3c-1.4 0-2.7-.4-3.8-1.2v5.6a6 6 0 11-6-6c.3 0 .7 0 1 .1v3.1a3 3 0 101.9 2.8V3h3.2z' },
  { key: 'strava', label: 'Strava', url: (h) => `https://strava.com/athletes/${h}`, color: '#FC4C02',
    icon: 'M15.4 14.7l-1.8-3.6h-2.7l4.5 8.9 4.5-8.9h-2.7l-1.8 3.6zM10 2L4.3 13.3h3.4L10 8.8l2.3 4.5h3.4L10 2z' },
];

function Icon({ d, color }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={color} aria-hidden="true"><path d={d} /></svg>
  );
}

export default function SocialLinks({ socials, isOwner }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const active = NETWORKS.filter((n) => socials[n.key]);

  async function save(e) {
    e.preventDefault();
    setError('');
    const f = new FormData(e.currentTarget);
    const res = await fetch('/api/socials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(NETWORKS.map((n) => [n.key, f.get(n.key)]))),
    });
    if (!res.ok) { setError((await res.json()).error ?? 'Could not save.'); return; }
    setEditing(false);
    router.refresh();
  }

  return (
    <div style={{ margin: '4px 0 14px' }}>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        {active.map((n) => (
          <a key={n.key} href={n.url(socials[n.key])} target="_blank" rel="noopener noreferrer"
            title={`${n.label}: ${socials[n.key]}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'var(--ink2)',
              border: '1px solid var(--border2)', borderRadius: 999, padding: '7px 14px', fontSize: 14, color: '#c9d6e0' }}>
            <Icon d={n.icon} color={n.color} /> {socials[n.key]}
          </a>
        ))}
        {isOwner && (
          <button className="chip" onClick={() => setEditing(!editing)}>
            {active.length ? 'Edit links' : '+ Add your socials'}
          </button>
        )}
      </div>

      {editing && (
        <form onSubmit={save} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginTop: 14, maxWidth: 640 }}>
          {NETWORKS.map((n) => (
            <div key={n.key}>
              <label style={{ display: 'block', font: '600 12px/1 Inter, sans-serif', color: '#9fb2c2', margin: '0 0 6px' }}>{n.label}</label>
              <input name={n.key} defaultValue={socials[n.key]} placeholder={n.key === 'strava' ? 'athlete id or handle' : '@handle'}
                style={{ width: '100%', background: 'var(--ink)', border: '1px solid var(--border2)', borderRadius: 8, padding: '9px 12px', color: 'var(--paper)', font: 'inherit', fontSize: 14 }} />
            </div>
          ))}
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 10, alignItems: 'center' }}>
            <button className="btn" style={{ padding: '9px 18px', fontSize: 14 }}>Save links</button>
            {error && <span className="err" style={{ display: 'inline' }}>{error}</span>}
          </div>
        </form>
      )}
    </div>
  );
}
