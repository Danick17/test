'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setError('');
    const f = new FormData(e.currentTarget);
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ handle: f.get('handle'), password: f.get('password') }),
    });
    const body = await res.json();
    if (!res.ok) { setError(body.error ?? 'Something went wrong.'); return; }
    router.push(`/athletes/${body.handle}`);
    router.refresh();
  }

  return (
    <main className="panel">
      <h2>Log in</h2>
      <form onSubmit={submit}>
        <label>Handle</label><input name="handle" required />
        <label>Password</label><input name="password" type="password" required />
        {error && <div className="err">{error}</div>}
        <button className="btn" style={{ width: '100%', marginTop: 18 }}>Log in</button>
      </form>
    </main>
  );
}
