"""Original royalty-free soundtrack for the Bestmark promo.
Scene boundaries (s): 0, 3.6, 8.4, 13.6, 18.8, 23.6, 28.4, 33.2, 37.6, end 42.8.
"""
import numpy as np
import wave

SR = 44100
DUR = 42.8
N = int(SR * DUR)
t = np.arange(N) / SR
mix = np.zeros(N)

def add(sig, start, gain=1.0):
    i0 = int(start * SR)
    i1 = min(N, i0 + len(sig))
    if i0 < N:
        mix[i0:i1] += sig[: i1 - i0] * gain

def env(n, a, d, sustain=0.0):
    e = np.zeros(n)
    ia, idec = int(a * SR), int(d * SR)
    ia = max(1, min(ia, n)); idec = max(1, min(idec, n - ia))
    e[:ia] = np.linspace(0, 1, ia)
    e[ia:ia + idec] = np.linspace(1, sustain, idec)
    e[ia + idec:] = sustain
    return e

def tone(freq, dur, a=0.01, d=0.3, harm=(1.0, 0.35, 0.12)):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    s = sum(g * np.sin(2 * np.pi * freq * (k + 1) * tt) for k, g in enumerate(harm))
    return s * env(n, a, d)

def bell(freq, dur=1.6):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    s = (np.sin(2 * np.pi * freq * tt) + 0.5 * np.sin(2 * np.pi * freq * 2.01 * tt)
         + 0.25 * np.sin(2 * np.pi * freq * 2.99 * tt))
    return s * np.exp(-3.2 * tt)

def kick(dur=0.35):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    f = 120 * np.exp(-22 * tt) + 45
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-9 * tt)

rng = np.random.default_rng(7)

def hat(dur=0.06):
    n = int(dur * SR)
    return rng.standard_normal(n) * np.exp(-60 * np.arange(n) / SR)

def whoosh(dur=0.5):
    n = int(dur * SR)
    noise = rng.standard_normal(n)
    # crude band sweep: modulate amplitude + integrate for low-passed feel
    lp = np.convolve(noise, np.ones(24) / 24, mode='same')
    e = np.sin(np.linspace(0, np.pi, n)) ** 2
    return lp * e

def pad(freqs, dur, gain=1.0):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * f * tt + i) * (1 + 0.15 * np.sin(2 * np.pi * 0.5 * tt + i))
            for i, f in enumerate(freqs))
    e = env(n, min(1.2, dur / 3), dur, 0.8)
    fade_out = np.ones(n); nf = int(min(1.5, dur / 3) * SR)
    fade_out[-nf:] = np.linspace(1, 0, nf)
    return s * e * fade_out * gain

A2, E3, A3, C4, E4, G4, A4, C5, E5, G5, A5 = 110, 164.81, 220, 261.63, 329.63, 392, 440, 523.25, 659.25, 783.99, 880

BEAT = 0.5  # 120 bpm
SCENES = [0, 3.6, 8.4, 13.6, 18.8, 23.6, 28.4, 33.2, 37.6]

# --- Intro pad + logo bell (0–3.6) ---
add(pad([A2, E3], 3.6), 0, 0.35)
add(bell(A5), 1.5, 0.30)
add(bell(E5), 1.62, 0.18)

# --- Heartbeat + dark arp (3.6–8.4) ---
b = 3.6
while b < 8.4:
    add(kick(), b, 0.55)
    b += BEAT * 2
for i, nfreq in enumerate([A3, C4, A3, E4, A3, C4, E4, C4] * 2):
    st = 3.6 + i * BEAT * 0.6
    if st < 8.2:
        add(tone(nfreq, 0.28, d=0.22), st, 0.16)
add(pad([A2, E3], 4.8), 3.6, 0.25)

# --- Main groove (8.4–33.2): kick each beat, hats off-beat, arp 8ths ---
ARP = [A3, C4, E4, G4, A4, G4, E4, C4]
b = 8.4
step = 0
while b < 33.2 - 0.1:
    if step % 2 == 0:
        add(kick(), b, 0.6)
    else:
        add(hat(), b, 0.22)
    octave = 2 if 18.8 <= b < 23.6 else 1  # lift during the score scene
    add(tone(ARP[step % 8] * octave, 0.24, d=0.2), b, 0.17)
    b += BEAT / 2
    step += 1
# bass movement under the groove
for i, (bf, st) in enumerate(zip([A2, A2, 98, 87.31, 82.41, 98, A2, A2, 98, 87.31], np.arange(8.4, 33.2, 2.4))):
    add(tone(bf, 2.3, a=0.05, d=2.0, harm=(1.0, 0.2)), st, 0.30)
# pads per section
add(pad([A3, C4, E4], 10.4), 8.4, 0.16)
add(pad([A3, C4, E4, A4], 4.8), 18.8, 0.22)   # score scene lift
add(pad([A3, E4, G4], 9.6), 23.6, 0.16)

# --- Community scene (33.2–37.6): keep groove energy, brighter pad ---
add(pad([A3, C4, E4, A4], 4.4), 33.2, 0.2)
b = 33.2
step = 0
while b < 37.4:
    add(kick(), b, 0.55) if step % 2 == 0 else add(hat(), b, 0.2)
    add(tone(ARP[step % 8] * 2, 0.22, d=0.18), b, 0.14)
    b += BEAT / 2
    step += 1

# --- Outro (37.6–42.8): drop to pad, final bell, fade ---
add(pad([A2, E3, A3, C4], 5.2), 37.6, 0.4)
add(bell(A5, 2.2), 38.4, 0.28)
add(bell(E5, 2.2), 38.55, 0.16)

# --- Whooshes at every scene boundary ---
for s in SCENES[1:]:
    add(whoosh(), s - 0.25, 0.5)

# Riser into the score scene
n = int(1.2 * SR)
tt = np.arange(n) / SR
riser = rng.standard_normal(n) * np.linspace(0, 1, n) ** 2
riser = np.convolve(riser, np.ones(8) / 8, mode='same')
add(riser, 18.8 - 1.2, 0.35)

# --- Master: soft clip, normalize, global fade out ---
mix = np.tanh(mix * 1.4)
mix /= np.max(np.abs(mix))
nf = int(1.8 * SR)
mix[-nf:] *= np.linspace(1, 0, nf)
mix *= 0.85

pcm = (mix * 32767).astype(np.int16)
with wave.open('promo-audio.wav', 'wb') as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print('wrote promo-audio.wav', DUR, 's')
