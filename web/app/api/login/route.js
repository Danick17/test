import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyPassword, createSession } from '@/lib/auth';

export async function POST(req) {
  const { handle, password } = await req.json();
  const athlete = db.prepare(
    'SELECT id, handle, password_hash FROM athletes WHERE handle = ? COLLATE NOCASE').get(handle ?? '');
  if (!athlete?.password_hash || !verifyPassword(password ?? '', athlete.password_hash))
    return NextResponse.json({ error: 'Wrong handle or password.' }, { status: 401 });
  await createSession(athlete.id);
  return NextResponse.json({ handle: athlete.handle });
}
