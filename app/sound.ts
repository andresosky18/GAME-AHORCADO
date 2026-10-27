'use client';

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) ctx = new AudioCtx();
  }
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
  return ctx;
}

function tone(freq: number, duration: number, type: OscillatorType = 'sine', delay = 0, gainVal = 0.08) {
  const c = getCtx();
  if (!c) return;
  const start = c.currentTime + delay;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(gainVal, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

export function playHit(enabled = true) {
  if (!enabled) return;
  tone(523.25, 0.11, 'triangle', 0, 0.09);
  tone(659.25, 0.16, 'triangle', 0.06, 0.09);
}

export function playMiss(enabled = true) {
  if (!enabled) return;
  tone(220, 0.14, 'sawtooth', 0, 0.04);
  tone(185, 0.18, 'sawtooth', 0.07, 0.04);
}

export function playRoundWin(enabled = true) {
  if (!enabled) return;
  tone(523.25, 0.14, 'triangle', 0, 0.1);
  tone(659.25, 0.14, 'triangle', 0.09, 0.1);
  tone(783.99, 0.14, 'triangle', 0.18, 0.1);
  tone(1046.5, 0.35, 'triangle', 0.27, 0.12);
}

export function playPodiumFanfare(enabled = true) {
  if (!enabled) return;
  // Staged celebratory fanfare matching the 3 -> 2 -> 1 podium rise
  tone(392.0, 0.18, 'triangle', 0.15, 0.09);
  tone(493.88, 0.18, 'triangle', 0.65, 0.1);
  tone(587.33, 0.2, 'triangle', 1.15, 0.11);
  tone(783.99, 0.55, 'triangle', 1.38, 0.14);
  tone(987.77, 0.65, 'sine', 1.52, 0.1);
}
