import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { hashPassword, createSession } from '@/lib/auth';
import { SPORTS } from '@/lib/score';

export async function POST(req) {
  const { name, handle, password, age, country, sports } = await req.json();

  if (!name?.trim()) return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
  if (!/^[a-zA-Z0-9_]{2,20}$/.test(handle ?? ''))
    return NextResponse.json({ error: 'Handle must be 2–20 letters, numbers, or underscores.' }, { status: 400 });
  if (!password || password.length < 8)
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
  if (!Number.isInteger(age) || age < 10 || age > 99)
    return NextResponse.json({ error: 'Age must be between 10 and 99.' }, { status: 400 });
  const cleanSports = (Array.isArray(sports) ? sports : []).filter((s) => SPORTS.includes(s));
  if (!cleanSports.length)
    return NextResponse.json({ error: 'Pick at least one sport.' }, { status: 400 });

  try {
    const { lastInsertRowid } = db.prepare(`
      INSERT INTO athletes (handle, name, age, country, sports, password_hash)
      VALUES (?, ?, ?, ?, ?, ?)`)
      .run(handle, name.trim(), age, (country ?? '').trim(), cleanSports.join(','), hashPassword(password));
    await createSession(lastInsertRowid);
    return NextResponse.json({ handle });
  } catch (e) {
    if (String(e.message).includes('UNIQUE'))
      return NextResponse.json({ error: 'That handle is taken — pick another.' }, { status: 409 });
    throw e;
  }
}
