/**
 * The app-flow scene's closing phone screen — the whole flow listed in the
 * site's own palette — drawn on a canvas. (The step screens are our real app
 * designs; see APP_SCREENS.) Pure drawing helpers (no React, no three.js).
 */

export const SCREEN_W = 780;
export const SCREEN_H = 1688;

const YELLOW = "#ffdb00";
const BLACK = "#07020d";

export type FlowStep = { title: string; description: string };

function statusBar(c: CanvasRenderingContext2D, font: string) {
  c.fillStyle = "#fff";
  c.font = `600 34px ${font}`;
  c.fillText("9:41", 70, 82);
  c.beginPath();
  c.roundRect(600, 60, 70, 30, 9);
  c.fill();
}
/** The closing screen: the phone lies on its back and its screen lists the whole flow. */
function flow(c: CanvasRenderingContext2D, font: string, steps: FlowStep[]) {
  const g = c.createLinearGradient(0, 0, 0, SCREEN_H);
  g.addColorStop(0, "#1d1d1b");
  g.addColorStop(1, BLACK);
  c.fillStyle = g;
  c.fillRect(0, 0, SCREEN_W, SCREEN_H);
  statusBar(c, font);
  c.fillStyle = YELLOW;
  c.font = `700 30px ${font}`;
  c.fillText("THE FULL FLOW", 70, 220);
  c.fillStyle = "#fff";
  c.font = `800 64px ${font}`;
  c.fillText("Idea to", 70, 310);
  c.fillText("App Store", 70, 384);
  const top = 500;
  const gap = Math.min(190, 1080 / Math.max(steps.length, 1));
  // Connecting line
  c.strokeStyle = "rgba(255,219,0,.35)";
  c.lineWidth = 6;
  c.beginPath();
  c.moveTo(110, top);
  c.lineTo(110, top + gap * (steps.length - 1));
  c.stroke();
  steps.forEach((s, i) => {
    const y = top + i * gap;
    c.fillStyle = YELLOW;
    c.beginPath();
    c.arc(110, y, 36, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = BLACK;
    c.font = `800 30px ${font}`;
    c.textAlign = "center";
    c.fillText(String(i + 1).padStart(2, "0"), 110, y + 11);
    c.textAlign = "left";
    c.fillStyle = "#fff";
    c.font = `700 40px ${font}`;
    c.fillText(s.title, 175, y + 14);
  });
}

/** Draw the closing screen (the full flow) onto a display-sized canvas. */
export function drawFlowScreen(canvas: HTMLCanvasElement, steps: FlowStep[], font: string) {
  const c = canvas.getContext("2d");
  if (!c) return;
  c.clearRect(0, 0, SCREEN_W, SCREEN_H);
  c.textBaseline = "alphabetic";
  flow(c, font, steps);
}
