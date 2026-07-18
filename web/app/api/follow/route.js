import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { currentAthlete } from '@/lib/auth';

export async function POST(req) {
  const me = await currentAthlete();
  if (!me) return NextResponse.json({ error: 'Log in to follow athletes.' }, { status: 401 });
  const { handle, action } = await req.json();
  const target = db.prepare('SELECT id FROM athletes WHERE handle = ? COLLATE NOCASE').get(handle ?? '');
  if (!target) return NextResponse.json({ error: 'Athlete not found.' }, { status: 404 });
  if (target.id === me.id) return NextResponse.json({ error: "You can't follow yourself." }, { status: 400 });

  if (action === 'unfollow') {
    db.prepare('DELETE FROM follows WHERE follower_id = ? AND athlete_id = ?').run(me.id, target.id);
  } else {
    db.prepare('INSERT OR IGNORE INTO follows (follower_id, athlete_id) VALUES (?, ?)').run(me.id, target.id);
  }
  const followers = db.prepare('SELECT COUNT(*) AS n FROM follows WHERE athlete_id = ?').get(target.id).n;
  return NextResponse.json({ ok: true, followers });
}
