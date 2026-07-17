'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SPORTS } from '@/lib/score';

export default function SignupPage() {
  const router = useRouter();
  const [sports, setSports] = useState([]);
  const [error, setError] = useState('');

  function toggle(s) {
    setSports((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    const f = new FormData(e.currentTarget);
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: f.get('name'), handle: f.get('handle'), password: f.get('password'),
        age: Number(f.get('age')), country: f.get('country'), sports,
      }),
    });
    const body = await res.json();
    if (!res.ok) { setError(body.error ?? 'Something went wrong.'); return; }
    router.push(`/athletes/${body.handle}`);
    router.refresh();
  }

  return (
    <main className="panel">
      <h2>Join Bestmark</h2>
      <p className="handle">Your bests, one shareable profile — visible to everyone.</p>
      <form onSubmit={submit}>
        <div className="row2">
          <div><label>Name</label><input name="name" required placeholder="Alex Rivera" /></div>
          <div><label>Handle</label>
            <input name="handle" required placeholder="alexr" pattern="[a-zA-Z0-9_]{2,20}"
              title="2–20 letters, numbers, or underscores" /></div>
        </div>
        <div className="row2">
          <div><label>Password</label><input name="password" type="password" required minLength={8} /></div>
          <div><label>Age</label><input name="age" type="number" min={10} max={99} defaultValue={30} required /></div>
        </div>
        <label>Country</label><input name="country" placeholder="Canada" />
        <label>Sports</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {SPORTS.map((s) => (
            <button type="button" key={s} className={`chip${sports.includes(s) ? ' on' : ''}`}
              onClick={() => toggle(s)}>
              {s[0].toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        {error && <div className="err">{error}</div>}
        <button className="btn" style={{ width: '100%', marginTop: 18 }}>Create profile</button>
      </form>
    </main>
  );
}
