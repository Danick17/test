import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import db from '@/lib/db';
import { currentAthlete } from '@/lib/auth';
import { coachSystemPrompt, fallbackCoachReply } from '@/lib/coach';

export async function POST(req) {
  const { messages } = await req.json();
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 40)
    return NextResponse.json({ error: 'Invalid conversation.' }, { status: 400 });

  const history = messages
    .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));
  if (history.length === 0 || history[history.length - 1].role !== 'user')
    return NextResponse.json({ error: 'Last message must be from you.' }, { status: 400 });

  const me = await currentAthlete();
  const prs = me
    ? db.prepare('SELECT event, time_display, time_seconds, verified FROM prs WHERE athlete_id = ? ORDER BY id').all(me.id)
    : [];

  const lastUser = history[history.length - 1].content;
  const hasCredentials = Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);
  if (!hasCredentials) {
    return NextResponse.json({ reply: fallbackCoachReply(me, prs, lastUser), source: 'fallback' });
  }

  try {
    const client = new Anthropic();
    const response = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 1024,
      thinking: { type: 'adaptive' },
      system: [{ type: 'text', text: coachSystemPrompt(me, prs), cache_control: { type: 'ephemeral' } }],
      messages: history,
    });
    if (response.stop_reason === 'refusal') {
      return NextResponse.json({ reply: "I can't help with that one — let's keep it to training. What are you working toward?", source: 'claude' });
    }
    const text = response.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n');
    return NextResponse.json({ reply: text, source: 'claude' });
  } catch (err) {
    if (
      err instanceof Anthropic.AuthenticationError ||
      err instanceof Anthropic.PermissionDeniedError ||
      err instanceof Anthropic.APIConnectionError ||
      /authentication method/i.test(err?.message ?? '')
    ) {
      return NextResponse.json({ reply: fallbackCoachReply(me, prs, lastUser), source: 'fallback' });
    }
    if (err instanceof Anthropic.RateLimitError)
      return NextResponse.json({ error: 'The coach is busy right now — try again in a minute.' }, { status: 429 });
    throw err;
  }
}
