import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  const athletes = db.prepare('SELECT COUNT(*) AS n FROM athletes').get().n;
  return NextResponse.json({ ok: true, athletes });
}
