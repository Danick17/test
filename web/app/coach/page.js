'use client';
import { useEffect, useRef, useState } from 'react';

const SUGGESTIONS = [
  'How do I improve my 5K PR?',
  'Build me a training week',
  'What should my easy pace be?',
  'How do I pace my next race?',
];

export default function CoachPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "I'm your Bestmark Coach. I can see the PRs on your profile (log in for personalized paces) and I'll help you plan how to beat them. What are you training for?" },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [source, setSource] = useState('');
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function send(text) {
    const content = (text ?? input).trim();
    if (!content || busy) return;
    const next = [...messages, { role: 'user', content }];
    setMessages(next);
    setInput('');
    setBusy(true);
    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.filter((m, i) => i > 0 || m.role === 'user') }),
      });
      const body = await res.json();
      if (res.ok && body.source) setSource(body.source);
      setMessages((cur) => [...cur, {
        role: 'assistant',
        content: res.ok ? body.reply : (body.error ?? 'Something went wrong — try again.'),
      }]);
    } catch {
      setMessages((cur) => [...cur, { role: 'assistant', content: 'Connection problem — try again.' }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="wrap" style={{ maxWidth: 720 }}>
      <section style={{ padding: '36px 0 12px' }}>
        <h1 style={{ letterSpacing: '-.02em' }}>Bestmark Coach <span className="mark">AI</span></h1>
        <p className="handle" style={{ fontSize: 14 }}>Training advice grounded in your marked bests.</p>
      </section>

      <div style={{ background: 'var(--ink2)', border: '1px solid var(--border)', borderRadius: 16, padding: 18, minHeight: 380, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '85%',
            background: m.role === 'user' ? 'var(--green)' : 'var(--ink)',
            color: m.role === 'user' ? 'var(--ink)' : 'var(--paper)',
            border: m.role === 'user' ? 'none' : '1px solid var(--border2)',
            borderRadius: 12,
            padding: '10px 14px',
            fontSize: 15,
            whiteSpace: 'pre-wrap',
          }}>{m.content}</div>
        ))}
        {busy && <div className="handle">Coach is thinking…</div>}
        <div ref={endRef} />
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '12px 0' }}>
        {SUGGESTIONS.map((s) => (
          <button key={s} className="chip" onClick={() => send(s)} disabled={busy}>{s}</button>
        ))}
      </div>

      <form style={{ display: 'flex', gap: 10, marginBottom: 60 }}
        onSubmit={(e) => { e.preventDefault(); send(); }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about training, pacing, race prep…"
          style={{ flex: 1, background: 'var(--ink2)', border: '1px solid var(--border2)', borderRadius: 8, padding: '12px 14px', color: 'var(--paper)', font: 'inherit' }}
        />
        <button className="btn" disabled={busy || !input.trim()}>Send</button>
      </form>
      {source === 'fallback' && (
        <p className="handle" style={{ fontSize: 12, margin: '-46px 0 60px' }}>
          Built-in coach: answers computed from your PRs. Claude-powered mode activates automatically when the server has an API key.
        </p>
      )}
    </main>
  );
}
