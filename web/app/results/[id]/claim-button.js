'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ClaimButton({ resultId }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function claim() {
    setBusy(true);
    setError('');
    const res = await fetch('/api/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resultId }),
    });
    if (res.ok) {
      router.refresh();
    } else {
      setError((await res.json()).error ?? 'Could not claim.');
      setBusy(false);
    }
  }

  return (
    <span>
      <button className="btn" style={{ padding: '7px 14px', fontSize: 13 }} onClick={claim} disabled={busy}>
        That&apos;s me — claim
      </button>
      {error && <div className="err" style={{ display: 'block' }}>{error}</div>}
    </span>
  );
}
