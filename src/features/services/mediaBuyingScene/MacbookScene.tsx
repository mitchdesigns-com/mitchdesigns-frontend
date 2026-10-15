"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type { MotionValue } from "framer-motion";
import { roundedPlane, slab } from "@/lib/three/shapes";
import { grainTexture } from "@/lib/three/textures";

/*
 * MacBook Pro 14" (312.6 × 221.2 × 15.5 mm), in world units (1 = 100 mm).
 * The base lies on y ≤ 0 (top deck at y = 0), front edge toward +z; the lid
 * hinges on the back edge.
 */
const BW = 3.126; // width
const BD = 2.212; // depth
const BT = 0.1; // base thickness
const BR = 0.14; // corner radius
const LT = 0.055; // lid thickness
const LH = 2.175; // lid height (hinge → top edge)
// Display (16:10-ish 3024 × 1964) and its bezels.
const SW = 3.026;
const SH = SW / 1.54;
const CHIN = 0.15; // bezel below the display
const OPEN = THREE.MathUtils.degToRad(108); // fully open, from closed
// Apple Space Grey: warm dark-neutral, bead-blasted aluminium.
const ALU = "#6b6c6f";
const WELL = "#121214";
const KEY = "#19191b";

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** A key: width in units (1u = 19 mm pitch), its legend, and how it's printed. */
type Key = { u: number; label?: string; small?: boolean; align?: "left" | "right"; split?: [string, string]; touchId?: boolean };
const k = (label: string, u = 1): Key => ({ u, label });
const mod = (label: string, u: number, align: "left" | "right" = "left"): Key => ({ u, label, small: true, align });
/** MacBook keyboard (US), row by row; the function row is half height and the
 *  up/down arrows share one key's space (inverted T). */
const ROWS: Array<{ keys: Key[]; h: number }> = [
  { keys: [mod("esc", 1.5), ...Array.from({ length: 12 }, (_, i) => ({ u: 1, label: `F${i + 1}`, small: true })), { u: 1, touchId: true }], h: 0.5 },
  { keys: [..."`1234567890-=".split("").map((c) => k(c)), mod("delete", 1.5, "right")], h: 1 },
  { keys: [mod("tab", 1.5), ..."QWERTYUIOP[]\\".split("").map((c) => k(c))], h: 1 },
  { keys: [mod("caps lock", 1.8), ..."ASDFGHJKL;'".split("").map((c) => k(c)), mod("return", 1.7, "right")], h: 1 },
  { keys: [mod("shift", 2.35), ..."ZXCVBNM,./".split("").map((c) => k(c)), mod("shift", 2.15, "right")], h: 1 },
  {
    keys: [mod("fn", 1), mod("control", 1), mod("option", 1), mod("command", 1.25, "right"), { u: 5 }, mod("command", 1.25), mod("option", 1), k("◀"), { u: 1, split: ["▲", "▼"] }, k("▶")],
    h: 1,
  },
];
const PITCH = 0.19;
const GAP = 0.032;
const KB_TOP = -BD / 2 + 0.14; // z of the function row's back edge
const KB_W = 14.5 * PITCH;
const KB_D = ROWS.reduce((d, r) => d + r.h * PITCH, 0);
const KEY_TOP = 0.0092; // key cap surface height above the deck

/** Every key cap rectangle (deck coordinates) with its legend. */
type Cap = { x: number; z: number; w: number; d: number; key: Key; label?: string };
const CAPS: Cap[] = (() => {
  const out: Cap[] = [];
  let z = KB_TOP;
  for (const row of ROWS) {
    const d = row.h * PITCH;
    let x = -(row.keys.reduce((a, key) => a + key.u, 0) * PITCH) / 2;
    for (const key of row.keys) {
      const cx = x + (key.u * PITCH) / 2;
      if (key.split) {
        // Up above down, each half height.
        out.push({ x: cx, z: z + d / 4, w: key.u * PITCH - GAP, d: d / 2 - GAP * 0.6, key, label: key.split[0] });
        out.push({ x: cx, z: z + (3 * d) / 4, w: key.u * PITCH - GAP, d: d / 2 - GAP * 0.6, key, label: key.split[1] });
      } else out.push({ x: cx, z: z + d / 2, w: key.u * PITCH - GAP, d: d - GAP, key, label: key.label });
      x += key.u * PITCH;
    }
    z += d;
  }
  return out;
})();

/** Key legends printed on a transparent sheet laid over the key caps. */
function legendTexture() {
  const S = 1400; // px per world unit
  const c = document.createElement("canvas");
  c.width = Math.round(KB_W * S);
  c.height = Math.round(KB_D * S);
  const g = c.getContext("2d")!;
  const font = getComputedStyle(document.body).fontFamily || "sans-serif";
  g.fillStyle = "rgba(235,235,238,0.92)";
  g.textBaseline = "middle";
  for (const cap of CAPS) {
    const cx = (cap.x + KB_W / 2) * S;
    const cy = (cap.z - KB_TOP) * S;
    const w = cap.w * S, d = cap.d * S;
    if (cap.key.touchId) {
      // Touch ID: a fine ring inside the key.
      g.strokeStyle = "rgba(160,160,168,0.6)";
      g.lineWidth = 3;
      g.beginPath();
      g.roundRect(cx - w / 2 + 10, cy - d / 2 + 8, w - 20, d - 16, 18);
      g.stroke();
      continue;
    }
    if (!cap.label) continue;
    if (cap.key.small) {
      g.font = `500 ${Math.round(d * 0.2)}px ${font}`;
      g.textAlign = cap.key.align === "right" ? "right" : cap.key.align === "left" ? "left" : "center";
      const tx = cap.key.align === "right" ? cx + w / 2 - 14 : cap.key.align === "left" ? cx - w / 2 + 14 : cx;
      const ty = cap.key.align ? cy + d / 2 - d * 0.2 : cy;
      g.fillText(cap.label, tx, ty);
    } else {
      g.font = `500 ${Math.round(d * (cap.key.split ? 0.5 : 0.34))}px ${font}`;
      g.textAlign = "center";
      g.fillText(cap.label, cx, cy + 2);
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/** Display glass: a soft diagonal sheen, brighter toward the top corner. */
function sheenTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 340;
  const g = c.getContext("2d")!;
  const grd = g.createLinearGradient(0, 0, 512, 340);
  grd.addColorStop(0, "rgba(255,255,255,0.16)");
  grd.addColorStop(0.32, "rgba(255,255,255,0.05)");
  grd.addColorStop(0.42, "rgba(255,255,255,0.11)");
  grd.addColorStop(0.5, "rgba(255,255,255,0)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 512, 340);
  return new THREE.CanvasTexture(c);
}

/** Speaker grille: a soft grid of tiny holes (alpha texture). */
function grilleTexture() {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 512;
  const g = c.getContext("2d")!;
  g.fillStyle = "#000";
  for (let y = 4; y < 512; y += 8)
    for (let x = 4 + ((y / 8) % 2) * 4; x < 64; x += 8) {
      g.beginPath();
      g.arc(x, y, 1.7, 0, Math.PI * 2);
      g.fill();
    }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

function Keyboard() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const geo = useMemo(() => new RoundedBoxGeometry(1, 0.01, 1, 2, 0.004), []);
  const legends = useMemo(() => legendTexture(), []);
  useEffect(() => () => legends.dispose(), [legends]);

  useEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const o = new THREE.Object3D();
    CAPS.forEach((cap, i) => {
      o.position.set(cap.x, KEY_TOP - 0.005, cap.z);
      o.scale.set(cap.w, 1, cap.d);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
    // Bounds of all the keys (not one unit key at the origin), so the
    // keyboard is never culled as off-screen.
    m.computeBoundingBox();
    m.computeBoundingSphere();
  }, []);

  return (
    <group>
      <instancedMesh ref={mesh} args={[geo, undefined, CAPS.length]} frustumCulled={false} castShadow receiveShadow>
        <meshPhysicalMaterial color={KEY} roughness={0.5} metalness={0.05} clearcoat={0.25} clearcoatRoughness={0.4} />
      </instancedMesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, KEY_TOP + 0.0004, KB_TOP + KB_D / 2]}>
        <planeGeometry args={[KB_W, KB_D]} />
        <meshBasicMaterial map={legends} transparent toneMapped={false} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Laptop({ progress, video }: { progress: MotionValue<number>; video: HTMLVideoElement | null }) {
  const body = useRef<THREE.Group>(null);
  const lid = useRef<THREE.Group>(null);
  const screen = useRef<THREE.MeshBasicMaterial>(null);
  const { camera, size } = useThree();

  const baseGeo = useMemo(() => {
    const g = slab(BW, BD, BR, BT, 0.018);
    g.rotateX(-Math.PI / 2); // lie flat: extrusion depth → height
    g.translate(0, -BT / 2, 0);
    return g;
  }, []);
  const lidGeo = useMemo(() => {
    const g = slab(BW, LH, BR, LT, 0.012);
    g.translate(0, LH / 2, -LT / 2); // hinge edge at y = 0, inner face at z = 0
    return g;
  }, []);
  const bezelGeo = useMemo(() => {
    const g = roundedPlane(BW - 0.03, LH - 0.03, BR - 0.015);
    g.translate(0, LH / 2, 0);
    return g;
  }, []);
  const screenGeo = useMemo(() => roundedPlane(SW, SH, 0.04), []);
  const notchGeo = useMemo(() => roundedPlane(0.32, 0.075, 0.03), []);
  const wellGeo = useMemo(() => roundedPlane(KB_W + 0.05, KB_D + 0.07, 0.05), []);
  const padGeo = useMemo(() => roundedPlane(1.34, 0.82, 0.05), []);
  const grille = useMemo(() => grilleTexture(), []);
  const grain = useMemo(() => grainTexture(), []);
  const sheen = useMemo(() => sheenTexture(), []);
  const padRimGeo = useMemo(() => roundedPlane(1.355, 0.835, 0.056), []);
  const glowLight = useRef<THREE.PointLight>(null);

  // Video drawn into a 1.54:1 canvas (contained, on white — the recording's
  // own background), refreshed each frame while it plays.
  const screenTex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 1600;
    c.height = Math.round(1600 / 1.54);
    const g = c.getContext("2d")!;
    g.fillStyle = "#fff";
    g.fillRect(0, 0, c.width, c.height);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return { c, g, t };
  }, []);
  useEffect(() => () => screenTex.t.dispose(), [screenTex]);
  const lastTime = useRef(-1);
  const wantsPlay = useRef(false);

  const target = useMemo(
    () => ({ cam: new THREE.Vector3(), look: new THREE.Vector3(), lookNow: new THREE.Vector3(0, 0.3, 0) }),
    [],
  );

  useFrame((state, delta) => {
    const p = progress.get();
    const damp = 1 - Math.exp(-delta * 7);
    const time = state.clock.elapsedTime;

    // Closed at a three-quarter angle; 0.1–0.68: the lid opens while the
    // laptop swings round to face you. Then it holds, screen playing.
    const open = smooth(0.1, 0.68, p);
    const turn = smooth(0.02, 0.72, p);
    const settled = smooth(0.68, 0.8, p);

    if (lid.current) {
      const want = Math.PI / 2 - open * OPEN;
      lid.current.rotation.x += (want - lid.current.rotation.x) * damp;
    }
    if (body.current) {
      const g = body.current;
      const yaw = -0.62 * (1 - turn);
      g.rotation.y += (yaw - g.rotation.y) * damp;
      const y = Math.sin(time * 0.9) * 0.01 * settled;
      g.position.y += (y - g.position.y) * damp;
    }

    // Camera: high three-quarter view of the closed lid → eye level, square
    // on to the open screen. Pulled back on narrow screens so it always fits.
    const fit = Math.max(1, 1.1 / (size.width / size.height));
    const k = smooth(0.04, 0.75, p);
    target.cam.set(0, THREE.MathUtils.lerp(4.9, 1.6, k) * fit, THREE.MathUtils.lerp(6, 6.1, k) * fit);
    target.look.set(0, THREE.MathUtils.lerp(-0.2, 0.72, k), THREE.MathUtils.lerp(0.1, -0.3, k));
    camera.position.lerp(target.cam, damp);
    target.lookNow.lerp(target.look, damp);
    camera.lookAt(target.lookNow);

    // Screen wakes as the lid passes ~40°, and shows the video.
    if (screen.current) {
      const on = smooth(0.32, 0.55, p);
      screen.current.color.setScalar(on);
      if (glowLight.current) glowLight.current.intensity = on * 0.7;
    }
    // The recording starts from the top once the lid is fully open, and
    // stops (ready to restart) when it closes again.
    if (video) {
      if (open > 0.97 && video.paused && !wantsPlay.current) {
        wantsPlay.current = true;
        video.currentTime = 0;
        void video.play().catch(() => {});
      } else if (open < 0.9 && wantsPlay.current) {
        wantsPlay.current = false;
        video.pause();
      }
    }
    if (video && video.readyState >= 2 && video.currentTime !== lastTime.current) {
      lastTime.current = video.currentTime;
      const { c, g, t } = screenTex;
      const h = (c.width * video.videoHeight) / video.videoWidth;
      g.fillStyle = "#fff";
      g.fillRect(0, 0, c.width, c.height);
      g.drawImage(video, 0, (c.height - h) / 2, c.width, h);
      t.needsUpdate = true;
    }
  });

  return (
    <group ref={body} rotation={[0, -0.62, 0]}>
      {/* Base: aluminium slab, keyboard well, keys, trackpad, speakers */}
      <mesh geometry={baseGeo} castShadow receiveShadow>
        <meshPhysicalMaterial color={ALU} metalness={1} roughness={0.42} roughnessMap={grain} bumpMap={grain} bumpScale={0.0006} clearcoat={0.12} clearcoatRoughness={0.5} />
      </mesh>
      <mesh geometry={wellGeo} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.0008, KB_TOP + KB_D / 2]} receiveShadow>
        <meshStandardMaterial color={WELL} roughness={0.8} />
      </mesh>
      <Keyboard />
      {/* Force Touch trackpad: glass in a fine machined outline */}
      <mesh geometry={padRimGeo} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.0007, BD / 2 - 0.07 - 0.41]}>
        <meshStandardMaterial color="#4a4b4e" metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh geometry={padGeo} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.0009, BD / 2 - 0.07 - 0.41]} receiveShadow>
        <meshPhysicalMaterial color="#68696c" metalness={0.7} roughness={0.38} clearcoat={0.5} clearcoatRoughness={0.35} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} rotation={[-Math.PI / 2, 0, 0]} position={[s * 1.47, 0.0009, KB_TOP + 0.53]}>
          <planeGeometry args={[0.1, 1.05]} />
          <meshBasicMaterial color="#000" alphaMap={grille} transparent opacity={0.85} depthWrite={false} />
        </mesh>
      ))}
      {/* Ports: MagSafe + 2× USB-C (left), HDMI + USB-C + SD (right) */}
      {[
        [-1, -0.62, 0.17],
        [-1, -0.32, 0.1],
        [-1, -0.14, 0.1],
        [1, -0.5, 0.15],
        [1, -0.25, 0.1],
        [1, 0.3, 0.2],
      ].map(([s, z, w]) => (
        <mesh key={`${s}${z}`} position={[s * (BW / 2 + 0.0005), -BT / 2, z]}>
          <boxGeometry args={[0.004, 0.032, w]} />
          <meshStandardMaterial color="#0b0b0d" roughness={0.6} />
        </mesh>
      ))}
      {/* Hinge barrel */}
      <mesh position={[0, -0.012, -BD / 2 + 0.03]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.032, 0.032, BW - 0.5, 32]} />
        <meshStandardMaterial color="#1c1c1f" roughness={0.45} metalness={0.6} />
      </mesh>

      {/* Lid, pivoting on the hinge */}
      <group ref={lid} position={[0, 0.004, -BD / 2 + 0.03]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh geometry={lidGeo} castShadow receiveShadow>
          <meshPhysicalMaterial color={ALU} metalness={1} roughness={0.4} roughnessMap={grain} bumpMap={grain} bumpScale={0.0006} clearcoat={0.15} clearcoatRoughness={0.45} />
        </mesh>
        {/* Black glass bezel, the display, the notch, and a glossy glass layer */}
        <mesh geometry={bezelGeo} position={[0, 0, 0.0008]}>
          <meshPhysicalMaterial color="#030304" roughness={0.12} metalness={0.2} clearcoat={1} />
        </mesh>
        <mesh geometry={screenGeo} position={[0, CHIN + SH / 2, 0.0014]}>
          <meshBasicMaterial ref={screen} map={screenTex.t} color="#000" toneMapped={false} />
        </mesh>
        <mesh geometry={notchGeo} position={[0, CHIN + SH - 0.022, 0.0018]}>
          <meshBasicMaterial color="#030304" />
        </mesh>
        {/* FaceTime camera lens in the notch */}
        <mesh position={[0, CHIN + SH - 0.012, 0.0021]}>
          <circleGeometry args={[0.011, 24]} />
          <meshPhysicalMaterial color="#0d1424" roughness={0.05} metalness={0.6} clearcoat={1} />
        </mesh>
        {/* Glass sheen over the display */}
        <mesh position={[0, CHIN + SH / 2, 0.003]}>
          <planeGeometry args={[SW, SH]} />
          <meshBasicMaterial map={sheen} transparent depthWrite={false} toneMapped={false} />
        </mesh>
        {/* Screen light falling on the keyboard and deck */}
        <pointLight ref={glowLight} position={[0, CHIN + SH * 0.5, 0.35]} intensity={0} distance={2.6} decay={2} color="#eef2ff" />
        <mesh geometry={bezelGeo} position={[0, 0, 0.0024]}>
          <meshPhysicalMaterial color="#ffffff" metalness={1} roughness={0.05} transparent opacity={0.05} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
}

/** Ease with a little overshoot, for props popping onto the desk. */
const backOut = (t: number) => {
  const c = 1.9;
  return t <= 0 ? 0 : t >= 1 ? 1 : 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
};
const DESK = -BT; // desk surface height

/** Coffee mug in our yellow, filled with dark coffee. `splash` (0–1) plays
 *  the landing slosh: the coffee surges up one side of the cup in a smooth
 *  curve, rolls across to the other side and settles — all inside the mug. */
const COFFEE = "#0c0503";
const LEVEL = 0.315; // coffee surface height inside the mug
const CUP_R = 0.185; // inner radius at that height

function Mug({ splash }: { splash: { current: number } }) {
  const surface = useRef<THREE.Mesh>(null);
  const body = useMemo(() => {
    // Profile: slightly tapered ceramic wall with a rounded lip and a hollow.
    const pts = [
      [0, 0], [0.17, 0], [0.19, 0.01], [0.2, 0.04], [0.215, 0.36], [0.212, 0.375], [0.2, 0.38],
      [0.19, 0.37], [0.18, 0.06], [0, 0.05],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    return new THREE.LatheGeometry(pts, 64);
  }, []);
  // A finely divided disc whose heights we bend into the slosh each frame.
  const liquid = useMemo(() => {
    const g = new THREE.CircleGeometry(CUP_R, 72, 0, Math.PI * 2);
    // Add rings so the surface can curve smoothly (CircleGeometry is a fan).
    const rings = 14, segs = 72;
    const pos: number[] = [];
    const idx: number[] = [];
    pos.push(0, 0, 0);
    for (let r = 1; r <= rings; r++)
      for (let s2 = 0; s2 < segs; s2++) {
        const a = (s2 / segs) * Math.PI * 2;
        const rr = (r / rings) * CUP_R;
        pos.push(Math.cos(a) * rr, 0, Math.sin(a) * rr);
      }
    const at = (r: number, s2: number) => (r === 0 ? 0 : 1 + (r - 1) * segs + (s2 % segs));
    for (let s2 = 0; s2 < segs; s2++) idx.push(0, at(1, s2 + 1), at(1, s2));
    for (let r = 1; r < rings; r++)
      for (let s2 = 0; s2 < segs; s2++) {
        const a0 = at(r, s2), a1 = at(r, s2 + 1), b0 = at(r + 1, s2), b1 = at(r + 1, s2 + 1);
        idx.push(a0, a1, b1, a0, b1, b0);
      }
    g.dispose();
    const out = new THREE.BufferGeometry();
    out.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    out.setIndex(idx);
    out.computeVertexNormals();
    return out;
  }, []);
  const base = useMemo(() => Float32Array.from(liquid.attributes.position.array), [liquid]);
  const last = useRef(-1);

  useFrame(() => {
    const t = splash.current;
    if (t === last.current || !surface.current) return;
    last.current = t;
    // Slosh: a damped swing — surges to one side, swings back across, settles.
    const swing = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 3.2) * Math.pow(1 - t, 1.4) * 0.06;
    const ripple = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.006;
    const pos = liquid.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = base[i * 3], z = base[i * 3 + 2];
      const r = Math.hypot(x, z) / CUP_R; // 0 centre → 1 wall
      const cos = r === 0 ? 0 : x / (r * CUP_R); // direction of the swing
      // The surface tilts with a curve that climbs the wall (stronger near
      // the edge), plus a soft ring rippling out from the centre.
      const y = swing * cos * (0.55 * r + 0.45 * r * r * r) + ripple * Math.cos(r * 9 - t * 30) * (1 - r * 0.6);
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
    liquid.computeVertexNormals();
  });

  return (
    <group>
      <mesh geometry={body} castShadow receiveShadow>
        <meshPhysicalMaterial color="#ffdb00" roughness={0.28} clearcoat={0.8} clearcoatRoughness={0.15} side={THREE.DoubleSide} />
      </mesh>
      {/* Coffee: a glossy liquid surface, sloshing inside the cup */}
      <mesh ref={surface} geometry={liquid} position={[0, LEVEL, 0]} rotation={[0, 0.6, 0]}>
        <meshPhysicalMaterial color={COFFEE} roughness={0.18} clearcoat={0.7} clearcoatRoughness={0.12} envMapIntensity={0.3} side={THREE.DoubleSide} />
      </mesh>
      {/* Handle */}
      <mesh position={[0.215, 0.2, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
        <torusGeometry args={[0.085, 0.024, 20, 48, Math.PI]} />
        <meshPhysicalMaterial color="#ffdb00" roughness={0.28} clearcoat={0.8} clearcoatRoughness={0.15} />
      </mesh>
    </group>
  );
}

/** Small potted plant: white ceramic pot, soil, and a cluster of leaves. */
function Plant() {
  const pot = useMemo(() => {
    const pts = [
      [0, 0], [0.13, 0], [0.15, 0.02], [0.18, 0.26], [0.19, 0.27], [0.185, 0.285], [0.17, 0.28], [0, 0.26],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    return new THREE.LatheGeometry(pts, 64);
  }, []);
  const leaves = useMemo(
    () =>
      Array.from({ length: 11 }, (_, i) => {
        const a = (i / 11) * Math.PI * 2 + (i % 2) * 0.3;
        const tall = 0.75 + ((i * 37) % 10) / 25;
        return { a, tilt: 0.35 + ((i * 53) % 10) / 30, tall };
      }),
    [],
  );
  const leaf = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (leaf.current) leaf.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8) * 0.02;
  });
  return (
    <group>
      <mesh geometry={pot}>
        <meshPhysicalMaterial color="#f4f2ee" roughness={0.45} clearcoat={0.4} />
      </mesh>
      <mesh position={[0, 0.262, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.17, 40]} />
        <meshStandardMaterial color="#3b2a1e" roughness={1} />
      </mesh>
      <group ref={leaf} position={[0, 0.26, 0]}>
        {leaves.map((l, i) => (
          <group key={i} rotation={[0, l.a, 0]}>
            <mesh rotation={[l.tilt, 0, 0]} position={[0, (0.22 * l.tall) / 1, 0]} scale={[0.07, 0.24 * l.tall, 0.022]}>
              <sphereGeometry args={[1, 20, 16]} />
              <meshPhysicalMaterial color={i % 3 ? "#2f7d4a" : "#3d9a5c"} roughness={0.4} clearcoat={0.5} clearcoatRoughness={0.3} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

/** Desk props that pop in beside the laptop once it's open (and away as it closes). */
function DeskProps({ progress }: { progress: MotionValue<number> }) {
  const mug = useRef<THREE.Group>(null);
  const plant = useRef<THREE.Group>(null);
  const splash = useRef(0);
  const { camera, size } = useThree();
  useFrame(() => {
    const p = progress.get();
    // Keep them inside the frame on narrow screens.
    const cam = camera as THREE.PerspectiveCamera;
    const halfW = cam.position.length() * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) * (size.width / size.height);
    const x = Math.min(2.05, halfW - 0.5);
    const pop = (from: number) => backOut(Math.min(1, Math.max(0, (p - from) / 0.08)));
    if (plant.current) {
      const s = pop(0.7);
      plant.current.scale.setScalar(Math.max(s, 0.0001));
      plant.current.position.set(-x, DESK, -0.45);
      plant.current.rotation.y = (1 - s) * -1.2;
    }
    if (mug.current) {
      const s = pop(0.75);
      mug.current.scale.setScalar(Math.max(s, 0.0001));
      mug.current.position.set(x - 0.1, DESK, 0.3);
      mug.current.rotation.y = -0.6 + (1 - s) * 1.4;
      // As it lands the mug rocks on its base (tipping toward you, so the
      // coffee shows) while the coffee sloshes inside, then both settle.
      const t = Math.min(1, Math.max(0, (p - 0.79) / 0.16));
      splash.current = t;
      mug.current.rotation.x = t > 0 && t < 1 ? Math.sin(t * Math.PI * 2.4) * Math.pow(1 - t, 1.3) * 0.32 : 0;
    }
  });
  return (
    <>
      <group ref={plant}>
        <Plant />
      </group>
      <group ref={mug}>
        <Mug splash={splash} />
      </group>
    </>
  );
}

export default function MacbookScene({ progress, src }: { progress: MotionValue<number>; src: { webm: string; mp4: string } }) {
  // The looping recording, muted (autoplay-safe), fed to the screen texture.
  const video = useMemo(() => {
    const v = document.createElement("video");
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.preload = "auto";
    return v;
  }, []);
  useEffect(() => {
    video.src = video.canPlayType('video/webm; codecs="vp9"') ? src.webm : src.mp4;
    // Decode the first frame so the screen shows it before playback starts.
    video.load();
    return () => {
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [video, src]);

  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 4.9, 6], fov: 30 }} gl={{ antialias: true, alpha: true }} aria-hidden>
      <ambientLight intensity={0.5} />
      {/* Key light: soft shadows of the lid across the keyboard, keys on the deck */}
      <directionalLight
        position={[2.5, 6, 3.5]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.01}
        shadow-radius={6}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
        shadow-camera-near={1}
        shadow-camera-far={14}
      />
      <directionalLight position={[-4, 3, 2]} intensity={0.45} />
      {/* Soft studio reflections (no network HDRI): wide softboxes plus thin
          strips that draw the bright highlights along the aluminium edges. */}
      <Environment resolution={512} environmentIntensity={1}>
        {/* A light studio around the laptop, so the metal reads as aluminium. */}
        <color attach="background" args={["#c9cbd1"]} />
        <Lightformer form="rect" intensity={3} position={[0, 5, 2]} rotation-x={Math.PI / 2} scale={[10, 4, 1]} />
        <Lightformer form="rect" intensity={2.4} position={[-5, 1.5, 1]} rotation-y={Math.PI / 2} scale={[0.5, 8, 1]} />
        <Lightformer form="rect" intensity={2.4} position={[5, 1.5, 1]} rotation-y={-Math.PI / 2} scale={[0.5, 8, 1]} />
        <Lightformer form="rect" intensity={1.6} position={[0, 1, 6]} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={0.6} position={[0, 0, -6]} scale={[12, 8, 1]} />
      </Environment>
      <Laptop progress={progress} video={video} />
      <DeskProps progress={progress} />
      <ContactShadows position={[0, -BT - 0.002, 0]} opacity={0.45} scale={8} blur={2.2} far={1.5} resolution={1024} />
    </Canvas>
  );
}
