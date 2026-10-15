"use client";

/**
 * Tiny scroll feedback: a soft synthesized "tick" (no audio file) and a short
 * haptic buzz. Browsers only allow sound after the visitor has interacted
 * with the page (click / tap / key — scrolling doesn't count). If the visitor
 * already did that earlier in this visit (e.g. played the homepage reel, or
 * clicked through the menu), sound is on straight away; otherwise the audio
 * context unlocks on their first such gesture and ticks stay silent until then.
 * Vibration works on Android browsers only (iOS Safari has no Vibration API).
 */
let ctx: AudioContext | null = null;
let unlocked = false;

function unlock() {
  if (unlocked || typeof window === "undefined") return;
  const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return;
  ctx = ctx ?? new Ctx();
  void ctx.resume();
  unlocked = true;
}

/** Unlock now if the page has already had a gesture; else wait for one. */
export function armTickFeedback() {
  const activation = (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation;
  if (activation?.hasBeenActive) unlock();
  const events = ["pointerdown", "keydown", "touchstart"] as const;
  // Keep listening until audio is really running (Safari can refuse the
  // early start above and only allow it inside a gesture).
  const onGesture = () => {
    unlock();
    void ctx?.resume();
    if (ctx?.state === "running") events.forEach((e) => window.removeEventListener(e, onGesture));
  };
  events.forEach((e) => window.addEventListener(e, onGesture, { passive: true }));
  return () => events.forEach((e) => window.removeEventListener(e, onGesture));
}

/** Peak loudness of the tick (0–1). */
const TICK_VOLUME = 0.25;

/** A ~25ms mechanical tick. */
export function tick() {
  if (!ctx || !unlocked || ctx.state !== "running") return;
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(1800, t);
  osc.frequency.exponentialRampToValueAtTime(900, t + 0.02);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(TICK_VOLUME, t + 0.002);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.03);
}

/** A short haptic tap where supported (Android). */
export function buzz(ms = 8) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(ms);
}
