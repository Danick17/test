import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { currentAthlete } from '@/lib/auth';
import { EVENTS, toSeconds } from '@/lib/score';

export async function DELETE(req) {
  const me = await currentAthlete();
  if (!me) return NextResponse.json({ error: 'Log in to manage your PRs.' }, { status: 401 });

  const { event } = await req.json();
  const info = db.prepare('DELETE FROM prs WHERE athlete_id = ? AND event = ?').run(me.id, event ?? '');
  if (info.changes === 0)
    return NextResponse.json({ error: 'No such PR on your board.' }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function POST(req) {
  const me = await currentAthlete();
  if (!me) return NextResponse.json({ error: 'Log in to add PRs.' }, { status: 401 });

  const { event, time } = await req.json();
  if (!EVENTS[event]) return NextResponse.json({ error: 'Unknown event.' }, { status: 400 });
  const seconds = toSeconds(time);
  if (seconds == null)
    return NextResponse.json({ error: `"${time}" isn't a valid time — use mm:ss or h:mm:ss.` }, { status: 400 });

  db.prepare(`
    INSERT INTO prs (athlete_id, event, time_display, time_seconds, verified)
    VALUES (?, ?, ?, ?, 0)
    ON CONFLICT (athlete_id, event)
    DO UPDATE SET time_display = excluded.time_display, time_seconds = excluded.time_seconds`)
    .run(me.id, event, String(time).trim(), seconds);

  return NextResponse.json({ ok: true });
}
