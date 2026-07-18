import { NextResponse } from 'next/server';
import { currentAthlete } from '@/lib/auth';
import { claimResult } from '@/lib/results';

export async function POST(req) {
  const me = await currentAthlete();
  if (!me) return NextResponse.json({ error: 'Log in to claim your result.' }, { status: 401 });
  const { resultId } = await req.json();
  const out = claimResult(Number(resultId), me.id);
  if (out.error) return NextResponse.json({ error: out.error }, { status: out.status });
  return NextResponse.json({ ok: true, handle: me.handle });
}
