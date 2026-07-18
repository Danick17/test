import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { currentAthlete } from '@/lib/auth';

const NETWORKS = ['instagram', 'facebook', 'tiktok', 'strava'];
const HANDLE_RE = /^[a-zA-Z0-9._-]{1,64}$/;

export async function POST(req) {
  const me = await currentAthlete();
  if (!me) return NextResponse.json({ error: 'Log in to edit your links.' }, { status: 401 });

  const body = await req.json();
  const values = {};
  for (const net of NETWORKS) {
    let v = String(body[net] ?? '').trim();
    // Accept pasted URLs or @handles; store the bare handle.
    v = v.replace(/^https?:\/\/(www\.)?(instagram\.com|facebook\.com|tiktok\.com|strava\.com\/athletes)\//i, '');
    v = v.replace(/^@/, '').replace(/\/+$/, '');
    if (v && !HANDLE_RE.test(v))
      return NextResponse.json({ error: `"${v}" isn't a valid ${net} handle.` }, { status: 400 });
    values[net] = v;
  }
  db.prepare('UPDATE athletes SET instagram = ?, facebook = ?, tiktok = ?, strava = ? WHERE id = ?')
    .run(values.instagram, values.facebook, values.tiktok, values.strava, me.id);
  return NextResponse.json({ ok: true, ...values });
}
