import Link from 'next/link';
import './globals.css';
import { currentAthlete } from '@/lib/auth';
import LogoutButton from './logout-button';

export const metadata = {
  title: 'Bestmark — Every best. On the record.',
  description: 'One profile for all your personal records across running, swimming, cycling, and triathlon.',
};

function Tick() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 13l5 6L21 4" stroke="#00C982" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function RootLayout({ children }) {
  const me = await currentAthlete();
  return (
    <html lang="en">
      <body>
        <header>
          <div className="wrap nav">
            <Link className="logo" href="/"><Tick /> bestmark</Link>
            <nav className="navlinks">
              {me ? (
                <>
                  <span className="whoami">@{me.handle}</span>
                  <Link className="btn ghost" href={`/athletes/${me.handle}`}>My profile</Link>
                  <LogoutButton />
                </>
              ) : (
                <>
                  <Link className="btn ghost" href="/login">Log in</Link>
                  <Link className="btn" href="/signup">Sign up</Link>
                </>
              )}
            </nav>
          </div>
        </header>
        {children}
        <footer>Bestmark — every athlete&apos;s bests, on the record. Verified marks come from official results.</footer>
      </body>
    </html>
  );
}
