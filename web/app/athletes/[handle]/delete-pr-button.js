'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeletePrButton({ event }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function remove() {
    if (!window.confirm(`Remove ${event} from your PR board? Race history is kept.`)) return;
    setBusy(true);
    const res = await fetch('/api/prs', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event }),
    });
    if (res.ok) router.refresh();
    else setBusy(false);
  }

  return (
    <button onClick={remove} disabled={busy} title={`Delete ${event} PR`}
      style={{ background: 'none', border: 'none', color: 'var(--slate)', cursor: 'pointer',
        fontSize: 15, padding: '2px 6px', lineHeight: 1 }}
      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--run)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--slate)'; }}>
      ✕
    </button>
  );
}
