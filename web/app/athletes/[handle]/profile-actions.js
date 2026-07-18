'use client';
import { useState } from 'react';
import Link from 'next/link';

function drawCard(canvas, { name, handle, event, time, score }) {
  const S = 1080;
  canvas.width = S; canvas.height = S;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#0F1E2E'; ctx.fillRect(0, 0, S, S);
  ctx.strokeStyle = '#22384e'; ctx.lineWidth = 2; ctx.strokeRect(40, 40, S - 80, S - 80);

  // Finish Tick
  ctx.strokeStyle = '#00C982'; ctx.lineWidth = 26; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(110, 160); ctx.lineTo(160, 215); ctx.lineTo(275, 105); ctx.stroke();
  ctx.fillStyle = '#F7F9FB'; ctx.font = '700 64px Inter, system-ui, sans-serif';
  ctx.fillText('bestmark', 320, 185);

  ctx.fillStyle = '#5C7080'; ctx.font = '600 34px Inter, system-ui, sans-serif';
  ctx.fillText('NEW MARK', 110, 360);
  ctx.fillStyle = '#F7F9FB'; ctx.font = '700 76px Inter, system-ui, sans-serif';
  ctx.fillText(event, 110, 450);

  ctx.fillStyle = '#F7F9FB'; ctx.font = '700 170px ui-monospace, Menlo, monospace';
  ctx.fillText(time, 105, 640);

  if (score != null) {
    ctx.fillStyle = '#FFC53D'; ctx.font = '700 84px ui-monospace, Menlo, monospace';
    ctx.fillText(score.toFixed(1), 110, 790);
    ctx.fillStyle = '#5C7080'; ctx.font = '600 30px Inter, system-ui, sans-serif';
    ctx.fillText('B E S T   S C O R E', 115, 840);
  }

  ctx.fillStyle = '#F7F9FB'; ctx.font = '600 44px Inter, system-ui, sans-serif';
  ctx.fillText(name, 110, 950);
  ctx.fillStyle = '#00C982'; ctx.font = '600 34px Inter, system-ui, sans-serif';
  ctx.fillText(`bestmark.com/@${handle}`, 110, 1000);
}

export default function ProfileActions({ handle, name, isOwner, loggedIn, initialFollowing, initialFollowers, bestPr }) {
  const [following, setFollowing] = useState(initialFollowing);
  const [followers, setFollowers] = useState(initialFollowers);
  const [shared, setShared] = useState('');

  async function toggleFollow() {
    const res = await fetch('/api/follow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ handle, action: following ? 'unfollow' : 'follow' }),
    });
    if (res.ok) {
      const body = await res.json();
      setFollowing(!following);
      setFollowers(body.followers);
    }
  }

  async function shareCard() {
    if (!bestPr) return;
    const canvas = document.createElement('canvas');
    drawCard(canvas, { name, handle, ...bestPr });
    const blob = await new Promise((r) => canvas.toBlob(r, 'image/png'));
    const file = new File([blob], `bestmark-${handle}.png`, { type: 'image/png' });
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: 'My Bestmark', text: `${bestPr.event} — ${bestPr.time}. Every best, on the record.` });
        setShared('Shared!');
        return;
      } catch { /* user cancelled — fall through to download */ }
    }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `bestmark-${handle}.png`;
    a.click();
    setShared('Card downloaded — post it anywhere.');
  }

  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', margin: '18px 0 6px' }}>
      {!isOwner && loggedIn && (
        <button className={following ? 'btn ghost' : 'btn'} onClick={toggleFollow}>
          {following ? 'Following ✓' : 'Follow'}
        </button>
      )}
      <span className="handle">{followers} follower{followers === 1 ? '' : 's'}</span>
      {bestPr && <button className="btn ghost" onClick={shareCard}>Share PR card</button>}
      <Link className="btn ghost" href={`/compare?a=${handle}`}>Compare</Link>
      {shared && <span className="mark">{shared}</span>}
    </div>
  );
}
