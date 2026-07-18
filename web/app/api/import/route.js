import { NextResponse } from 'next/server';
import { ingestRace } from '@/lib/results';
import { toSeconds } from '@/lib/score';

// Official-results ingestion endpoint for timing partners / race directors.
// Auth: x-import-key header must match BESTMARK_IMPORT_KEY (a demo key is
// used when unset so the flow can be exercised out of the box).
//
// JSON body: { race: { name, event, date, location? }, results: [{ name, time, place? }] }
// CSV body:  { race: {...}, csv: "place,name,time\n1,Jane Doe,36:48\n..." }
export async function POST(req) {
  const key = req.headers.get('x-import-key');
  const expected = process.env.BESTMARK_IMPORT_KEY || 'demo-import-key';
  if (key !== expected)
    return NextResponse.json({ error: 'Invalid import key.' }, { status: 401 });

  const body = await req.json();
  const race = body.race ?? {};
  let results = Array.isArray(body.results) ? body.results : [];

  if (typeof body.csv === 'string') {
    const lines = body.csv.trim().split(/\r?\n/);
    const header = lines[0].toLowerCase().split(',').map((h) => h.trim());
    const iName = header.indexOf('name');
    const iTime = header.indexOf('time');
    const iPlace = header.indexOf('place');
    if (iName === -1 || iTime === -1)
      return NextResponse.json({ error: 'CSV must have "name" and "time" columns.' }, { status: 400 });
    results = lines.slice(1).map((line) => {
      const cols = line.split(',').map((c) => c.trim());
      return { name: cols[iName], time: cols[iTime], place: iPlace >= 0 ? Number(cols[iPlace]) || undefined : undefined };
    });
  }

  const bad = results.find((r) => !r.name || toSeconds(r.time) == null);
  if (bad)
    return NextResponse.json({ error: `Invalid row: ${JSON.stringify(bad)}` }, { status: 400 });

  try {
    const summary = ingestRace({ ...race, results });
    return NextResponse.json(summary, { status: summary.skipped ? 200 : 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
