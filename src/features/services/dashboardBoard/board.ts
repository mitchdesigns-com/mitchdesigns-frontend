/**
 * Shared helpers for the animated dashboard "boards" in service heroes
 * (exported widget SVGs, inlined so their parts can move, toured by a camera).
 */

/** Camera shot on a board of size w × h: centre (board units) and zoom, as GSAP props. */
export const cameraShot = (w: number, h: number) => (cx: number, cy: number, s: number) => ({
  scale: s,
  xPercent: (0.5 - (s * cx) / w) * 100,
  yPercent: (0.5 - (s * cy) / h) * 100,
});

/** Centre of an element in its SVG's viewBox units (measured on screen). */
export function centreIn(svg: SVGSVGElement, el: Element) {
  const box = svg.getBoundingClientRect();
  const vb = svg.viewBox.baseVal;
  const r = el.getBoundingClientRect();
  return {
    x: ((r.left + r.width / 2 - box.left) / box.width) * vb.width,
    y: ((r.top + r.height / 2 - box.top) / box.height) * vb.height,
  };
}

/** Make an inlined export scale with its slot. */
export function fluidSvg(svg: SVGSVGElement) {
  svg.removeAttribute("width");
  svg.removeAttribute("height");
  svg.style.width = "100%";
  svg.style.height = "auto";
  svg.style.overflow = "visible";
}
