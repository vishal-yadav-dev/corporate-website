"use client";

/**
 * Card interaction sounds, synthesised with the Web Audio API.
 *
 * Nothing is downloaded — the tones are generated in the browser, so this costs
 * zero bytes of payload. Off by default; the visitor opts in and the choice
 * persists. Note that browsers keep an AudioContext suspended until the page
 * has been interacted with, so the first sound anyone hears is always a click.
 */

const KEY = "ns-sfx";
type Listener = (on: boolean) => void;

let enabled = false;
let ctx: AudioContext | null = null;
let lastHover = 0;
const listeners = new Set<Listener>();

export function readSfx(): boolean {
  try {
    return localStorage.getItem(KEY) === "on";
  } catch {
    return false;
  }
}

export function setSfxOn(on: boolean) {
  enabled = on;
  try { localStorage.setItem(KEY, on ? "on" : "off"); } catch {}
  listeners.forEach((l) => l(on));
  if (on) void ensureCtx()?.resume();
}

export function subscribeSfx(l: Listener) {
  listeners.add(l);
  return () => { listeners.delete(l); };
}

/** Pick up the stored preference once the client is running. */
export function initSfx() {
  enabled = readSfx();
  listeners.forEach((l) => l(enabled));
}

function ensureCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  ctx ??= new AC();
  return ctx;
}

type ToneOpts = { type?: OscillatorType; duration?: number; gain?: number; glideTo?: number };

function tone(freq: number, { type = "sine", duration = 0.08, gain = 0.05, glideTo }: ToneOpts = {}) {
  const c = ensureCtx();
  if (!c) return;
  if (c.state === "suspended") void c.resume();

  const t = c.currentTime;
  const osc = c.createOscillator();
  const amp = c.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t + duration);

  /* A 4ms attack and an exponential release. Gating a raw oscillator on and off
     produces an audible pop rather than a tone. */
  amp.gain.setValueAtTime(0.0001, t);
  amp.gain.exponentialRampToValueAtTime(gain, t + 0.004);
  amp.gain.exponentialRampToValueAtTime(0.0001, t + duration);

  osc.connect(amp).connect(c.destination);
  osc.start(t);
  osc.stop(t + duration + 0.02);
}

/** Dry, quiet tick. Rate-limited so sweeping across a grid does not machine-gun. */
export function playHover() {
  if (!enabled) return;
  const now = performance.now();
  if (now - lastHover < 70) return;
  lastHover = now;
  tone(1320, { type: "sine", duration: 0.05, gain: 0.022 });
}

/** Rounder, rising two-tone — reads as confirmation rather than a warning. */
export function playClick() {
  if (!enabled) return;
  tone(620, { type: "triangle", duration: 0.11, gain: 0.05, glideTo: 960 });
}
