'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EVENTS } from '@/lib/score';

export default function AddPrForm() {
  const router = useRouter();
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setError('');
    const form = new FormData(e.currentTarget);
    const res = await fetch('/api/prs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: form.get('event'), time: form.get('time') }),
    });
    if (!res.ok) {
      setError((await res.json()).error ?? 'Something went wrong.');
      return;
    }
    e.target.reset?.();
    router.refresh();
  }

  return (
    <form className="addpr" onSubmit={submit}>
      <div>
        <label>Event</label>
        <select name="event">
          {Object.keys(EVENTS).map((ev) => <option key={ev}>{ev}</option>)}
        </select>
      </div>
      <div>
        <label>Time (mm:ss or h:mm:ss)</label>
        <input name="time" placeholder="e.g. 21:04 or 1:34:12" required />
      </div>
      <button className="btn">Add / update PR</button>
      {error && <div className="err" style={{ gridColumn: '1 / -1' }}>{error}</div>}
    </form>
  );
}
