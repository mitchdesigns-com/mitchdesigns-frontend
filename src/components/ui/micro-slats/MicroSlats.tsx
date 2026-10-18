"use client";

// MicroSlats background (React Bits, MIT), ported to TypeScript: a field of
// slats rolling like a sea, which the cursor stirs as a fluid.

import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import { Renderer, Program, Mesh, Triangle, RenderTarget, Texture, type OGLRenderingContext } from "ogl";
import {
  advectFragment,
  curlFragment,
  divergenceFragment,
  fieldFragment,
  fluidVertex,
  passVertex,
  pressureFragment,
  projectFragment,
  scaleFragment,
  slatFragment,
  splatFragment,
  vorticityFragment,
} from "./shaders";

type Wave = {
  scale: number;
  speed: number;
  direction: number;
  chop: number;
  stretch: number;
  glint: number;
  contrast: number;
  perspective: number;
  fog: number;
};

const SWELL_PRESETS: Record<"swell" | "tide" | "storm" | "signal", Wave> = {
  swell: { scale: 1.5, speed: 0.6, direction: 250, chop: 0.55, stretch: 0, glint: 0.7, contrast: 1.25, perspective: 0.55, fog: 0.55 },
  tide: { scale: 1.3, speed: 0.5, direction: 262, chop: 0.2, stretch: 0.12, glint: 0.45, contrast: 1.1, perspective: 0.5, fog: 0.4 },
  storm: { scale: 0.55, speed: 1.6, direction: 236, chop: 1, stretch: 0.3, glint: 1.3, contrast: 1.8, perspective: 0.8, fog: 0.35 },
  signal: { scale: 0.85, speed: 1.2, direction: 180, chop: 0.6, stretch: 0.85, glint: 0.25, contrast: 1.2, perspective: 0, fog: 0 },
};

const FLUID_SIZE = 96;
const PRESSURE_STEPS = 16;
const SPLAT_FORCE = 6900;
const SPLASH_JETS = 3;
const PIXEL_BUDGET = 4.5e6;

type RGBA = [number, number, number, number];
type Vec2 = [number, number];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const parseColor = (value: string, fallback: RGBA): RGBA => {
  try {
    const ctx = document.createElement("canvas").getContext("2d");
    if (!ctx) return fallback;
    ctx.fillStyle = "#000000";
    ctx.fillStyle = value;
    const resolved = String(ctx.fillStyle);
    if (resolved.startsWith("#")) {
      const n = parseInt(resolved.slice(1), 16);
      return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255, 1];
    }
    const parts = resolved.match(/[\d.]+/g);
    if (!parts || parts.length < 3) return fallback;
    return [Number(parts[0]) / 255, Number(parts[1]) / 255, Number(parts[2]) / 255, parts[3] ? Number(parts[3]) : 1];
  } catch {
    return fallback;
  }
};

export type MicroSlatsProps = Partial<Wave> & {
  preset?: keyof typeof SWELL_PRESETS;
  color?: string;
  glintColor?: string;
  backgroundColor?: string;
  slatWidth?: number;
  slatHeight?: number;
  gap?: number;
  roundness?: number;
  interactive?: boolean;
  cursorStrength?: number;
  cursorSize?: number;
  swirl?: number;
  trail?: number;
  lean?: number;
  intro?: boolean;
  introDuration?: number;
  paused?: boolean;
  className?: string;
  style?: CSSProperties;
};

type Settings = Wave & {
  color: RGBA;
  glintColor: RGBA;
  backgroundColor: RGBA;
  slatWidth: number;
  slatHeight: number;
  gap: number;
  roundness: number;
  interactive: boolean;
  cursorStrength: number;
  cursorSize: number;
  swirl: number;
  trail: number;
  lean: number;
  intro: boolean;
  introDuration: number;
  paused: boolean;
};

type Pair = { read: RenderTarget; write: RenderTarget; swap(): void };
type Fluid = {
  width: number;
  height: number;
  velocity: Pair;
  ink: Pair;
  pressure: Pair;
  divergence: RenderTarget;
  curl: RenderTarget;
};
/** [u, v, du, dv, splash turn (null = a drag)] */
type Splat = [number, number, number, number, number | null];

export function MicroSlats({
  preset = "swell",
  color = "#A855F7",
  glintColor = "#ffffff",
  backgroundColor = "#000000",
  slatWidth = 10,
  slatHeight = 25,
  gap = 3,
  roundness = 0.75,
  scale,
  speed,
  direction,
  chop,
  stretch,
  glint,
  contrast,
  perspective,
  fog,
  interactive = true,
  cursorStrength = 1,
  cursorSize = 40,
  swirl = 0,
  trail = 1.4,
  lean = 0,
  intro = true,
  introDuration = 1.5,
  paused = false,
  className = "",
  style,
}: MicroSlatsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<Settings | null>(null);
  const wakeRef = useRef<(() => void) | null>(null);

  const colors = useMemo(
    () => ({
      color: parseColor(color, [0.66, 0.33, 0.97, 1]),
      glintColor: parseColor(glintColor, [1, 1, 1, 1]),
      backgroundColor: parseColor(backgroundColor, [0, 0, 0, 1]),
    }),
    [color, glintColor, backgroundColor],
  );

  useEffect(() => {
    const base = SWELL_PRESETS[preset] ?? SWELL_PRESETS.swell;
    settingsRef.current = {
      ...colors,
      slatWidth,
      slatHeight,
      gap,
      roundness,
      scale: scale ?? base.scale,
      speed: speed ?? base.speed,
      direction: direction ?? base.direction,
      chop: chop ?? base.chop,
      stretch: stretch ?? base.stretch,
      glint: glint ?? base.glint,
      contrast: contrast ?? base.contrast,
      perspective: perspective ?? base.perspective,
      fog: fog ?? base.fog,
      interactive,
      cursorStrength,
      cursorSize,
      swirl,
      trail,
      lean,
      intro,
      introDuration,
      paused,
    };
    wakeRef.current?.();
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const renderer = new Renderer({ alpha: true, premultipliedAlpha: true, antialias: false, depth: false });
    const gl: OGLRenderingContext = renderer.gl;
    if (!renderer.isWebgl2) {
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      return undefined;
    }
    const gl2 = gl as unknown as WebGL2RenderingContext;
    gl.clearColor(0, 0, 0, 0);
    const canvas = gl.canvas;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.setAttribute("aria-hidden", "true");
    container.appendChild(canvas);

    const geometry = new Triangle(gl);
    const blank = new Texture(gl);
    const floatTargets = !!(gl.getExtension("EXT_color_buffer_float") || gl.getExtension("EXT_color_buffer_half_float"));

    const dispose = (target: RenderTarget) => {
      gl.deleteFramebuffer(target.buffer);
      gl.deleteTexture(target.texture.texture);
    };

    let fieldTarget = new RenderTarget(gl, { width: 1, height: 1, depth: false, minFilter: gl.NEAREST, magFilter: gl.NEAREST });

    const fieldUniforms = {
      uSize: { value: [1, 1] as Vec2 },
      uGrid: { value: [1, 1, 1, 1] as RGBA },
      uOrigin: { value: [0, 0] as Vec2 },
      uSlat: { value: [1, 1] as Vec2 },
      uTime: { value: 0 },
      uScale: { value: 1 },
      uDirection: { value: 0 },
      uChop: { value: 0.5 },
      uStretch: { value: 0.3 },
      uGlint: { value: 1 },
      uContrast: { value: 1 },
      uPerspective: { value: 0.7 },
      uFog: { value: 0.5 },
      uIntro: { value: 0 },
      tVelocity: { value: blank as Texture },
      tInk: { value: blank as Texture },
      uFluidTexel: { value: [1, 1] as Vec2 },
      uFluid: { value: 0 },
      uInk: { value: 1 },
      uLean: { value: 0.5 },
    };
    const fieldMesh = new Mesh(gl, {
      geometry,
      program: new Program(gl, { vertex: passVertex, fragment: fieldFragment, uniforms: fieldUniforms, depthTest: false, depthWrite: false }),
    });

    const slatUniforms = {
      tField: { value: fieldTarget.texture },
      uSize: { value: [1, 1] as Vec2 },
      uDpr: { value: 1 },
      uGrid: { value: [1, 1, 1, 1] as RGBA },
      uOrigin: { value: [0, 0] as Vec2 },
      uSlat: { value: [1, 1] as Vec2 },
      uRound: { value: 1 },
      uTilt: { value: 0 },
      uColor: { value: [1, 1, 1] as number[] },
      uGlintColor: { value: [1, 1, 1] as number[] },
      uBackground: { value: [0, 0, 0, 1] as RGBA },
    };
    const slatMesh = new Mesh(gl, {
      geometry,
      program: new Program(gl, { vertex: passVertex, fragment: slatFragment, uniforms: slatUniforms, depthTest: false, depthWrite: false }),
    });

    const fluidTexel = { value: [1, 1] as Vec2 };
    const fluidPass = (fragment: string, uniforms: Record<string, { value: unknown }>) =>
      new Mesh(gl, {
        geometry,
        program: new Program(gl, {
          vertex: fluidVertex,
          fragment,
          uniforms: { uTexel: fluidTexel, ...uniforms },
          depthTest: false,
          depthWrite: false,
        }),
      });
    const splatPass = fluidPass(splatFragment, {
      uTarget: { value: blank },
      uAspect: { value: 1 },
      uPoint: { value: [0, 0] },
      uValue: { value: [0, 0, 0] },
      uRadius: { value: 0.01 },
    });
    const curlPass = fluidPass(curlFragment, { uVelocity: { value: blank } });
    const vorticityPass = fluidPass(vorticityFragment, {
      uVelocity: { value: blank },
      uCurl: { value: blank },
      uSwirl: { value: 20 },
      uDt: { value: 0.016 },
    });
    const divergencePass = fluidPass(divergenceFragment, { uVelocity: { value: blank } });
    const pressurePass = fluidPass(pressureFragment, { uPressure: { value: blank }, uDivergence: { value: blank } });
    const projectPass = fluidPass(projectFragment, { uPressure: { value: blank }, uVelocity: { value: blank } });
    const advectPass = fluidPass(advectFragment, {
      uVelocity: { value: blank },
      uSource: { value: blank },
      uDt: { value: 0.016 },
      uFade: { value: 1 },
    });
    const scalePass = fluidPass(scaleFragment, { uSource: { value: blank }, uValue: { value: 0 } });
    const u = (mesh: Mesh) => mesh.program.uniforms as Record<string, { value: unknown }>;

    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    let width = 1;
    let height = 1;
    let raf = 0;
    let last = performance.now();
    let time = 0;
    let introClock = 0;
    let visible = true;
    let alive = true;
    let fluid: Fluid | null = null;
    let fluidUntil = 0;
    let fluidDirty = false;
    let splashTurn = 0;
    const splats: Splat[] = [];
    const pointer = { x: 0, y: 0, tracked: false };

    const run = (mesh: Mesh, target: RenderTarget) => renderer.render({ scene: mesh, target, clear: false });

    const floatTarget = (w: number, h: number) =>
      new RenderTarget(gl, {
        width: w,
        height: h,
        depth: false,
        type: gl2.HALF_FLOAT,
        format: gl.RGBA,
        internalFormat: gl2.RGBA16F,
        minFilter: gl.LINEAR,
        magFilter: gl.LINEAR,
      });

    const swapPair = (w: number, h: number): Pair => ({
      read: floatTarget(w, h),
      write: floatTarget(w, h),
      swap() {
        const next = this.read;
        this.read = this.write;
        this.write = next;
      },
    });

    const disposeFluid = () => {
      if (!fluid) return;
      [fluid.velocity, fluid.ink, fluid.pressure].forEach((pair) => {
        dispose(pair.read);
        dispose(pair.write);
      });
      dispose(fluid.divergence);
      dispose(fluid.curl);
      fluid = null;
    };

    const buildFluid = () => {
      if (!floatTargets) return;
      const aspect = width / height;
      const w = Math.max(8, Math.round(aspect >= 1 ? FLUID_SIZE * aspect : FLUID_SIZE));
      const h = Math.max(8, Math.round(aspect >= 1 ? FLUID_SIZE : FLUID_SIZE / aspect));
      if (fluid && fluid.width === w && fluid.height === h) return;
      disposeFluid();
      fluid = {
        width: w,
        height: h,
        velocity: swapPair(w, h),
        ink: swapPair(w, h),
        pressure: swapPair(w, h),
        divergence: floatTarget(w, h),
        curl: floatTarget(w, h),
      };
      fluidTexel.value = [1 / w, 1 / h];
    };

    const layout = (s: Settings) => {
      const slatW = clamp(s.slatWidth, 1, 64);
      const slatH = clamp(s.slatHeight, 2, 240);
      const gapSize = clamp(s.gap, 0, 64);
      const pitchX = slatW + gapSize;
      const pitchY = slatH + gapSize;
      const cols = Math.min(2048, Math.ceil((width + gapSize) / pitchX) + 1);
      const rows = Math.min(2048, Math.ceil((height + gapSize) / pitchY) + 1);
      const originX = (width - (cols * pitchX - gapSize)) / 2;
      const originY = (height - (rows * pitchY - gapSize)) / 2;
      if (fieldTarget.width !== cols || fieldTarget.height !== rows) {
        dispose(fieldTarget);
        fieldTarget = new RenderTarget(gl, { width: cols, height: rows, depth: false, minFilter: gl.NEAREST, magFilter: gl.NEAREST });
        slatUniforms.tField.value = fieldTarget.texture;
      }
      const tilt = Math.min(0.42, Math.asin(clamp((pitchX * 1.5 - slatW * 0.5) / (slatH * 0.5), 0, 1)));
      return { slatW, slatH, tilt, grid: [cols, rows, pitchX, pitchY] as RGBA, origin: [originX, originY] as Vec2 };
    };

    const splat = (pair: Pair, point: Vec2, value: number[], radius: number) => {
      const p = u(splatPass);
      p.uTarget!.value = pair.read.texture;
      p.uAspect!.value = width / height;
      p.uPoint!.value = point;
      p.uValue!.value = value;
      p.uRadius!.value = radius;
      run(splatPass, pair.write);
      pair.swap();
    };

    const stepFluid = (f: Fluid, dt: number, s: Settings) => {
      if (s.swirl > 0) {
        u(curlPass).uVelocity!.value = f.velocity.read.texture;
        run(curlPass, f.curl);

        const vorticity = u(vorticityPass);
        vorticity.uVelocity!.value = f.velocity.read.texture;
        vorticity.uCurl!.value = f.curl.texture;
        vorticity.uSwirl!.value = clamp(s.swirl, 0, 2) * 40;
        vorticity.uDt!.value = dt;
        run(vorticityPass, f.velocity.write);
        f.velocity.swap();
      }

      u(divergencePass).uVelocity!.value = f.velocity.read.texture;
      run(divergencePass, f.divergence);

      u(scalePass).uSource!.value = f.pressure.read.texture;
      u(scalePass).uValue!.value = 0.8;
      run(scalePass, f.pressure.write);
      f.pressure.swap();

      u(pressurePass).uDivergence!.value = f.divergence.texture;
      for (let i = 0; i < PRESSURE_STEPS; i++) {
        u(pressurePass).uPressure!.value = f.pressure.read.texture;
        run(pressurePass, f.pressure.write);
        f.pressure.swap();
      }

      u(projectPass).uPressure!.value = f.pressure.read.texture;
      u(projectPass).uVelocity!.value = f.velocity.read.texture;
      run(projectPass, f.velocity.write);
      f.velocity.swap();

      const fade = 1 / clamp(s.trail, 0.1, 10);
      const advect = u(advectPass);
      advect.uDt!.value = dt;
      advect.uVelocity!.value = f.velocity.read.texture;
      advect.uSource!.value = f.velocity.read.texture;
      advect.uFade!.value = fade * 1.4;
      run(advectPass, f.velocity.write);
      f.velocity.swap();

      advect.uVelocity!.value = f.velocity.read.texture;
      advect.uSource!.value = f.ink.read.texture;
      advect.uFade!.value = fade;
      run(advectPass, f.ink.write);
      f.ink.swap();
    };

    const clearFluid = (f: Fluid) => {
      u(scalePass).uValue!.value = 0;
      [f.velocity, f.ink, f.pressure].forEach((pair) => {
        u(scalePass).uSource!.value = pair.read.texture;
        run(scalePass, pair.write);
        pair.swap();
      });
    };

    const frame = (now: number) => {
      raf = 0;
      if (!alive) return;
      const s = settingsRef.current;
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;
      if (!s) return;

      if (!s.paused && !reducedMotion) time += dt * s.speed;
      introClock = s.intro && !reducedMotion ? introClock + dt / Math.max(0.2, s.introDuration) : 1;
      const introLinear = Math.min(introClock, 1);
      const introEase =
        introLinear < 0.5 ? 4 * introLinear * introLinear * introLinear : 1 - Math.pow(-2 * introLinear + 2, 3) / 2;

      if (fluid && splats.length) {
        const radius = Math.pow(clamp(s.cursorSize, 4, 600) / height, 2) * 0.35;
        const aspect = width / height;
        for (const [su, sv, du, dv, turn] of splats) {
          if (turn === null) {
            splat(fluid.velocity, [su, sv], [du * SPLAT_FORCE, dv * SPLAT_FORCE, 0], radius);
            splat(fluid.ink, [su, sv], [0.13, 0, 0], radius);
            continue;
          }
          const jet = radius * 0.55;
          const reach = Math.sqrt(jet * 0.5) * 1.9;
          const push = SPLAT_FORCE * 0.08;
          for (let i = 0; i < SPLASH_JETS; i++) {
            const angle = turn + (i / SPLASH_JETS) * Math.PI * 2;
            const dx = Math.cos(angle);
            const dy = Math.sin(angle);
            const point: Vec2 = [su + (dx * reach) / aspect, sv + dy * reach];
            const spin = [(dx - dy) * Math.SQRT1_2 * push, (dy + dx) * Math.SQRT1_2 * push, 0];
            splat(fluid.velocity, point, spin, jet);
            splat(fluid.ink, point, [0.75, 0, 0], jet);
          }
          splat(fluid.ink, [su, sv], [0.45, 0, 0], radius);
        }
        splats.length = 0;
        fluidDirty = true;
      }
      const fluidActive = fluid !== null && now < fluidUntil;
      if (fluid) {
        if (fluidActive) stepFluid(fluid, Math.min(Math.max(dt, 1 / 240), 1 / 30), s);
        else if (fluidDirty) {
          clearFluid(fluid);
          fluidDirty = false;
        }
      }

      const grid = layout(s);

      fieldUniforms.uSize.value = [width, height];
      fieldUniforms.uGrid.value = grid.grid;
      fieldUniforms.uOrigin.value = grid.origin;
      fieldUniforms.uSlat.value = [grid.slatW, grid.slatH];
      fieldUniforms.uTime.value = time;
      fieldUniforms.uScale.value = s.scale;
      fieldUniforms.uDirection.value = (s.direction * Math.PI) / 180;
      fieldUniforms.uChop.value = clamp(s.chop, 0, 1.5);
      fieldUniforms.uStretch.value = clamp(s.stretch, 0, 0.95);
      fieldUniforms.uGlint.value = Math.max(0, s.glint);
      fieldUniforms.uContrast.value = clamp(s.contrast, 0.2, 4);
      fieldUniforms.uPerspective.value = clamp(s.perspective, 0, 1);
      fieldUniforms.uFog.value = clamp(s.fog, 0, 1);
      fieldUniforms.uIntro.value = introEase;
      fieldUniforms.uFluid.value = fluidActive ? 1 : 0;
      fieldUniforms.tVelocity.value = fluid ? fluid.velocity.read.texture : blank;
      fieldUniforms.tInk.value = fluid ? fluid.ink.read.texture : blank;
      fieldUniforms.uFluidTexel.value = fluidTexel.value;
      fieldUniforms.uInk.value = clamp(s.cursorStrength, 0, 3);
      fieldUniforms.uLean.value = clamp(s.lean, 0, 1);
      renderer.render({ scene: fieldMesh, target: fieldTarget });

      slatUniforms.uSize.value = [width, height];
      slatUniforms.uDpr.value = renderer.dpr;
      slatUniforms.uGrid.value = grid.grid;
      slatUniforms.uOrigin.value = grid.origin;
      slatUniforms.uSlat.value = [grid.slatW, grid.slatH];
      slatUniforms.uRound.value = clamp(s.roundness, 0, 1);
      slatUniforms.uTilt.value = fluidActive && s.lean > 0 ? grid.tilt : 0;
      slatUniforms.uColor.value = s.color.slice(0, 3);
      slatUniforms.uGlintColor.value = s.glintColor.slice(0, 3);
      slatUniforms.uBackground.value = s.backgroundColor;
      renderer.render({ scene: slatMesh });

      const moving = (!s.paused && !reducedMotion && s.speed !== 0) || introClock < 1;
      if (visible && (moving || fluidActive || fluidDirty)) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (raf || !visible || !alive) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const resize = () => {
      width = Math.max(1, container.clientWidth);
      height = Math.max(1, container.clientHeight);
      renderer.dpr = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(PIXEL_BUDGET / (width * height)));
      renderer.setSize(width, height);
      buildFluid();
      start();
    };

    const locate = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const w = Math.max(1, rect.width);
      const h = Math.max(1, rect.height);
      return { x, y, u: x / w, v: 1 - y / h, h, inside: x >= 0 && y >= 0 && x <= w && y <= h };
    };

    const queue = (su: number, sv: number, du: number, dv: number, turn: number | null) => {
      if (splats.length > 32) splats.shift();
      splats.push([su, sv, du, dv, turn]);
      const s = settingsRef.current;
      fluidUntil = performance.now() + Math.max(1.5, (s ? s.trail : 1.4) * 5) * 1000;
      start();
    };

    const onPointerMove = (e: PointerEvent) => {
      const s = settingsRef.current;
      const spot = locate(e);
      if (!fluid || !s || !s.interactive || reducedMotion || !spot.inside) {
        pointer.tracked = false;
        return;
      }
      if (pointer.tracked && (spot.x !== pointer.x || spot.y !== pointer.y)) {
        queue(spot.u, spot.v, (spot.x - pointer.x) / spot.h, (pointer.y - spot.y) / spot.h, null);
      }
      pointer.x = spot.x;
      pointer.y = spot.y;
      pointer.tracked = true;
    };

    const onPointerDown = (e: PointerEvent) => {
      const s = settingsRef.current;
      const spot = locate(e);
      if (!fluid || !s || !s.interactive || reducedMotion || !spot.inside) return;
      splashTurn += 2.39996;
      queue(spot.u, spot.v, 0, 0, splashTurn);
    };

    const onPointerLeave = () => {
      pointer.tracked = false;
    };
    const onPointerOut = (e: PointerEvent) => {
      if (!e.relatedTarget) onPointerLeave();
    };
    const onVisibility = () => {
      if (!document.hidden) start();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerout", onPointerOut, { passive: true });
    window.addEventListener("blur", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting;
      start();
    });
    intersectionObserver.observe(container);

    wakeRef.current = start;
    resize();

    return () => {
      alive = false;
      visible = false;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("blur", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      wakeRef.current = null;
      disposeFluid();
      dispose(fieldTarget);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, []);

  return <div ref={containerRef} className={`relative size-full overflow-hidden ${className}`.trim()} style={style} />;
}
