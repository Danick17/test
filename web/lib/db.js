import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');
fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(path.join(DATA_DIR, 'bestmark.db'));
db.pragma('busy_timeout = 10000');
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS athletes (
    id INTEGER PRIMARY KEY,
    handle TEXT NOT NULL UNIQUE COLLATE NOCASE,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    country TEXT NOT NULL DEFAULT '',
    sports TEXT NOT NULL,            -- comma-separated: run,swim,bike,tri
    verified INTEGER NOT NULL DEFAULT 0,
    password_hash TEXT,              -- null for seeded profiles without accounts
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS prs (
    id INTEGER PRIMARY KEY,
    athlete_id INTEGER NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    event TEXT NOT NULL,
    time_display TEXT NOT NULL,
    time_seconds REAL NOT NULL,
    verified INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE (athlete_id, event)
  );
  CREATE TABLE IF NOT EXISTS races (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    event TEXT NOT NULL,             -- one of the EVENTS keys
    date TEXT NOT NULL,              -- ISO date
    location TEXT NOT NULL DEFAULT '',
    source TEXT NOT NULL DEFAULT 'official',
    UNIQUE (name, date)
  );
  CREATE TABLE IF NOT EXISTS results (
    id INTEGER PRIMARY KEY,
    race_id INTEGER NOT NULL REFERENCES races(id) ON DELETE CASCADE,
    athlete_id INTEGER REFERENCES athletes(id) ON DELETE SET NULL,  -- null = unclaimed
    athlete_name TEXT NOT NULL,      -- name as printed in the official results
    place INTEGER,
    time_display TEXT NOT NULL,
    time_seconds REAL NOT NULL
  );
  CREATE TABLE IF NOT EXISTS follows (
    follower_id INTEGER NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    athlete_id INTEGER NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (follower_id, athlete_id)
  );
  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    athlete_id INTEGER NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

const SEED = [
  ['mayatri', 'Maya Chen', 44, 'USA', 'tri,run,swim',
    [['Olympic Tri', '2:24:10'], ['Half Marathon', '1:34:12'], ['1500m Free', '21:45'], ['Sprint Tri', '1:12:40']]],
  ['rajmasters', 'Raj Patel', 61, 'UK', 'run,swim',
    [['5K Run', '20:58'], ['10K Run', '43:37'], ['400m Free', '5:41']]],
  ['sofruns', 'Sofia Almeida', 27, 'Brazil', 'run',
    [['5K Run', '16:41'], ['10K Run', '34:59'], ['Half Marathon', '1:16:22'], ['Marathon', '2:41:03']]],
  ['tomasbike', 'Tomás Ortega', 35, 'Spain', 'bike,tri',
    [['40K Bike TT', '54:12'], ['Ironman 70.3', '4:31:20']]],
  ['aikoswim', 'Aiko Tanaka', 22, 'Japan', 'swim',
    [['100m Free', '0:56'], ['400m Free', '4:21'], ['1500m Free', '17:13']]],
  ['liamoc', "Liam O'Connor", 39, 'Ireland', 'run,tri',
    [['Marathon', '3:02:44'], ['Olympic Tri', '2:41:55'], ['10K Run', '38:20']]],
  ['fzahra', 'Fatima Zahra', 31, 'Morocco', 'run',
    [['10K Run', '36:48'], ['Half Marathon', '1:21:15']]],
  ['eriktt', 'Erik Lindqvist', 48, 'Sweden', 'bike',
    [['40K Bike TT', '58:47']]],
];

import { toSeconds } from './score.js';

if (db.prepare('SELECT COUNT(*) AS n FROM athletes').get().n === 0) {
  const insA = db.prepare(
    'INSERT INTO athletes (handle, name, age, country, sports, verified) VALUES (?, ?, ?, ?, ?, 1)');
  const insP = db.prepare(
    'INSERT INTO prs (athlete_id, event, time_display, time_seconds, verified) VALUES (?, ?, ?, ?, 1)');
  const seed = db.transaction(() => {
    for (const [handle, name, age, country, sports, prs] of SEED) {
      const { lastInsertRowid } = insA.run(handle, name, age, country, sports);
      for (const [event, t] of prs) insP.run(lastInsertRowid, event, t, toSeconds(t));
    }
  });
  seed();
}

export default db;
