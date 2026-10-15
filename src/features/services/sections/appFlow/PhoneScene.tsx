"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
import type { MotionValue } from "framer-motion";
import { SCREEN_H, SCREEN_W, drawFlowScreen, type FlowStep } from "./screens";
import { flowPosition } from "./flowPosition";
import { roundedPlane, slab } from "@/lib/three/shapes";

// iPhone 16 proportions (71.6 × 147.6 × 7.8 mm), in world units.
const W = 0.776;
const H = 1.6;
const D = 0.085;
const R = 0.103; // corner radius
const BEZEL = 0.022;
const SW = W - BEZEL * 2; // display
const SH = H - BEZEL * 2;
// Space grey: anodised aluminium frame, frosted glass back.
const FRAME = "#9a9ea6";
const BACK = "#5c5f66";

/** Resting tilt per step while it faces you: [rotX, rotY, rotZ]. Between
 *  steps the phone also makes one full turn around its long axis. */
const POSES: Array<[number, number, number]> = [
  [0.08, -0.22, 0.05],
  [-0.1, 0.2, -0.06],
  [0.12, -0.16, 0.08],
  [0.04, 0.24, -0.03],
  [-0.08, -0.2, -0.07],
  [0.1, 0.16, 0.05],
  [-0.06, -0.18, -0.04],
  [0.07, 0.2, 0.06],
];
/** Closing pose: lying on its back, turned a little on the table. */
const LYING: [number, number, number] = [-Math.PI / 2, 0, 0.42];
const TURN = Math.PI * 2;

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * The screen's own area in an export: the whole image, unless it sits in a
 * fully transparent margin (an export with padding and a shadow) — then the
 * solid part only. Transparent areas inside the design are left alone.
 */
function screenBounds(img: HTMLImageElement): [number, number, number, number] {
  const c = document.createElement("canvas");
  c.width = img.width;
  c.height = img.height;
  const g = c.getContext("2d", { willReadFrequently: true })!;
  g.drawImage(img, 0, 0);
  const { data, width, height } = g.getImageData(0, 0, img.width, img.height);
  const a = (x: number, y: number) => data[(y * width + x) * 4 + 3];
  const edgesClear = [0, height - 1].every((y) => Array.from({ length: width }, (_, x) => a(x, y)).every((v) => v < 8)) &&
    [0, width - 1].every((x) => Array.from({ length: height }, (_, y) => a(x, y)).every((v) => v < 8));
  if (!edgesClear) return [0, 0, width, height];
  let x0 = width, y0 = height, x1 = 0, y1 = 0;
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++)
      if (a(x, y) > 250) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
  return x1 > x0 ? [x0, y0, x1 - x0 + 1, y1 - y0 + 1] : [0, 0, width, height];
}

/** Soft radial glow sprite for the screen light at the end. */
function glowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grd.addColorStop(0, "rgba(255,236,150,0.9)");
  grd.addColorStop(0.4, "rgba(255,219,0,0.35)");
  grd.addColorStop(1, "rgba(255,219,0,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

function Phone({
  progress,
  steps,
  screens,
  font,
}: {
  progress: MotionValue<number>;
  steps: FlowStep[];
  screens: string[];
  font: string;
}) {
  const group = useRef<THREE.Group>(null);
  const screen = useRef<THREE.MeshBasicMaterial>(null);
  const glow = useRef<THREE.MeshBasicMaterial>(null);
  const shown = useRef(-1);
  const { camera } = useThree();

  // Our app designs, one per step, then the closing flow screen. Each is
  // set on white (some exports are transparent) and cover-fitted to the display.
  const textures = useMemo(() => {
    const make = () => {
      const c = document.createElement("canvas");
      c.width = SCREEN_W;
      c.height = SCREEN_H;
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      return { c, t };
    };
    const shots = steps.map((_, i) => {
      const { c, t } = make();
      const img = new Image();
      img.onload = () => {
        const g = c.getContext("2d")!;
        g.fillStyle = "#fff";
        g.fillRect(0, 0, SCREEN_W, SCREEN_H);
        const [sx, sy, sw, sh] = screenBounds(img);
        const s = Math.max(SCREEN_W / sw, SCREEN_H / sh);
        const w = sw * s, h = sh * s;
        g.drawImage(img, sx, sy, sw, sh, (SCREEN_W - w) / 2, (SCREEN_H - h) / 2, w, h);
        t.needsUpdate = true;
      };
      img.src = screens[i % screens.length];
      return t;
    });
    const { c, t } = make();
    drawFlowScreen(c, steps, font);
    t.needsUpdate = true;
    return [...shots, t];
  }, [steps, screens, font]);
  useEffect(() => {
    // New textures → force the screen to pick its map again on the next frame.
    shown.current = -1;
    return () => textures.forEach((t) => t.dispose());
  }, [textures]);

  const screenGeo = useMemo(() => roundedPlane(SW, SH, R - BEZEL * 0.6), []);
  const glassGeo = useMemo(() => roundedPlane(W, H, R), []);
  const islandGeo = useMemo(() => roundedPlane(0.2, 0.058, 0.029), []);
  const frameGeo = useMemo(() => slab(W, H, R, D, 0.012), []);
  const backGeo = useMemo(() => roundedPlane(W - 0.012, H - 0.012, R - 0.006), []);
  // iPhone 16: two lenses stacked in a raised glass pill.
  const pillGeo = useMemo(() => slab(0.2, 0.39, 0.1, 0.014, 0.005), []);
  const glowTex = useMemo(() => glowTexture(), []);

  const target = useMemo(() => ({ rot: new THREE.Euler(), pos: new THREE.Vector3(), cam: new THREE.Vector3() }), []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const { index, from, to, t, end } = flowPosition(progress.get(), steps.length);
    const a = from >= steps.length ? LYING : POSES[from % POSES.length];
    const b = to >= steps.length ? LYING : POSES[to % POSES.length];
    const k = smooth(0, 1, t);
    const bob = 1 - end;
    const time = state.clock.elapsedTime;
    // One full spin per step (screens swap while its back faces you), so the
    // spin keeps rolling through the whole section; the last one lays it down.
    target.rot.set(
      THREE.MathUtils.lerp(a[0], b[0], k) + Math.sin(time * 0.8) * 0.025 * bob,
      THREE.MathUtils.lerp(a[1], b[1], k) + (from + k) * TURN + Math.sin(time * 0.5) * 0.04 * bob,
      THREE.MathUtils.lerp(a[2], b[2], k),
    );
    target.pos.set(0, Math.sin(time * 1.1) * 0.03 * bob - end * 0.15, 0);
    // Ease toward the target so scroll jumps still glide.
    const damp = 1 - Math.exp(-delta * 6);
    g.rotation.x += (target.rot.x - g.rotation.x) * damp;
    g.rotation.y += (target.rot.y - g.rotation.y) * damp;
    g.rotation.z += (target.rot.z - g.rotation.z) * damp;
    g.position.lerp(target.pos, damp);

    // Camera rises to look down at the phone lying on its back.
    target.cam.set(0, end * 2.4, 3.8 - end * 1.1);
    camera.position.lerp(target.cam, damp);
    camera.lookAt(0, -end * 0.15, 0);

    // Screen content swaps mid-spin, while the back faces the camera.
    if (screen.current && shown.current !== index) {
      shown.current = index;
      screen.current.map = textures[index];
      screen.current.needsUpdate = true;
    }
    if (glow.current) glow.current.opacity = end * 0.75;
  });

  return (
    <group ref={group}>
      {/* Anodised aluminium frame: flat sides, softly bevelled edges */}
      <mesh geometry={frameGeo}>
        <meshPhysicalMaterial color={FRAME} metalness={1} roughness={0.24} clearcoat={0.5} clearcoatRoughness={0.15} />
      </mesh>
      {/* Front: black glass, the lit display, Dynamic Island, and a glossy
          glass layer on top that catches the studio reflections */}
      <mesh geometry={glassGeo} position={[0, 0, D / 2 + 0.0006]}>
        <meshPhysicalMaterial color="#020203" roughness={0.05} metalness={0.2} clearcoat={1} />
      </mesh>
      <mesh geometry={screenGeo} position={[0, 0, D / 2 + 0.0012]}>
        {/* Map is set per frame (below), never via props, so a re-render can't reset it. */}
        <meshBasicMaterial ref={screen} toneMapped={false} />
      </mesh>
      <mesh geometry={islandGeo} position={[0, SH / 2 - 0.06, D / 2 + 0.0016]}>
        <meshBasicMaterial color="#000" />
      </mesh>
      <mesh geometry={glassGeo} position={[0, 0, D / 2 + 0.002]}>
        <meshPhysicalMaterial color="#ffffff" metalness={1} roughness={0.04} transparent opacity={0.07} depthWrite={false} />
      </mesh>
      {/* Back: frosted space grey glass */}
      <mesh geometry={backGeo} position={[0, 0, -D / 2 - 0.0006]} rotation={[0, Math.PI, 0]}>
        <meshPhysicalMaterial color={BACK} roughness={0.62} metalness={0.08} clearcoat={0.25} clearcoatRoughness={0.5} />
      </mesh>
      {/* Buttons: Action + volume (left), side button (right), and the
          sapphire Camera Control below it */}
      {[
        { x: -1, y: 0.46, h: 0.075 },
        { x: -1, y: 0.31, h: 0.12 },
        { x: -1, y: 0.16, h: 0.12 },
        { x: 1, y: 0.3, h: 0.18 },
      ].map((b) => (
        <RoundedBox key={`${b.x}${b.y}`} args={[0.012, b.h, 0.03]} radius={0.005} smoothness={4} position={[b.x * (W / 2 + 0.003), b.y, 0]}>
          <meshPhysicalMaterial color={FRAME} metalness={1} roughness={0.28} clearcoat={0.5} />
        </RoundedBox>
      ))}
      <RoundedBox args={[0.006, 0.11, 0.026]} radius={0.003} smoothness={4} position={[W / 2 + 0.0005, -0.17, 0]}>
        <meshPhysicalMaterial color="#141418" roughness={0.08} metalness={0.5} clearcoat={1} />
      </RoundedBox>
      {/* Antenna lines and the USB-C port on the frame */}
      {[
        [W / 2 + 0.0004, H / 2 - 0.16, 0.004, 0.012],
        [-W / 2 - 0.0004, H / 2 - 0.16, 0.004, 0.012],
        [W / 2 + 0.0004, -H / 2 + 0.16, 0.004, 0.012],
        [-W / 2 - 0.0004, -H / 2 + 0.16, 0.004, 0.012],
      ].map(([x, y, w, h]) => (
        <mesh key={`${x}${y}`} position={[x, y, 0]}>
          <boxGeometry args={[w, h, D * 0.8]} />
          <meshStandardMaterial color="#2a2b2f" roughness={0.6} />
        </mesh>
      ))}
      <RoundedBox args={[0.1, 0.006, 0.03]} radius={0.003} smoothness={4} position={[0, -H / 2 - 0.0005, 0]}>
        <meshStandardMaterial color="#0a0a0c" roughness={0.6} />
      </RoundedBox>
      {/* Back camera (top-left seen from behind): raised glass pill, two
          metal-ringed sapphire lenses, flash beside them */}
      <group position={[W / 2 - 0.17, H / 2 - 0.27, -D / 2]} rotation={[0, Math.PI, 0]}>
        <mesh geometry={pillGeo} position={[0, 0, 0.006]}>
          <meshPhysicalMaterial color={BACK} roughness={0.12} metalness={0.4} clearcoat={1} />
        </mesh>
        {[0.095, -0.095].map((y) => (
          <group key={y} position={[0, y, 0.014]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.066, 0.068, 0.02, 64]} />
              <meshPhysicalMaterial color="#8d9096" metalness={1} roughness={0.18} clearcoat={0.6} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.0105]}>
              <cylinderGeometry args={[0.052, 0.052, 0.002, 64]} />
              <meshPhysicalMaterial color="#04060b" roughness={0.02} metalness={0.6} clearcoat={1} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.0115]}>
              <cylinderGeometry args={[0.022, 0.022, 0.001, 48]} />
              <meshPhysicalMaterial color="#1a2238" roughness={0.02} metalness={0.8} clearcoat={1} />
            </mesh>
          </group>
        ))}
      </group>
      <mesh position={[W / 2 - 0.3, H / 2 - 0.19, -D / 2 - 0.002]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.004, 32]} />
        <meshStandardMaterial color="#eae4d2" roughness={0.35} />
      </mesh>
      {/* Screen light spilling out around the phone once it lies on its back
          (a halo just behind it, so the flow on the screen stays crisp). */}
      <mesh position={[0, 0, -D / 2 - 0.02]} scale={[1.4, 2.15, 1]}>
        <planeGeometry />
        <meshBasicMaterial ref={glow} map={glowTex} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

export default function PhoneScene({
  progress,
  steps,
  screens,
}: {
  progress: MotionValue<number>;
  steps: FlowStep[];
  screens: string[];
}) {
  const font = typeof document === "undefined" ? "sans-serif" : getComputedStyle(document.body).fontFamily;
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 3.8], fov: 32 }}
      gl={{ antialias: true, alpha: true }}
      aria-hidden
    >
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} />
      <directionalLight position={[0, 0, 6]} intensity={0.6} />
      <directionalLight position={[-4, -2, 3]} intensity={0.35} color="#ffdb00" />
      {/* Studio reflections from soft light panels and strips (no network
          HDRI) — the strips draw the bright edge highlights on the metal. */}
      <Environment resolution={512} environmentIntensity={1.5}>
        <Lightformer form="rect" intensity={4} position={[0, 4, 3]} scale={[8, 1.5, 1]} />
        <Lightformer form="rect" intensity={2.5} position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[0.6, 8, 1]} />
        <Lightformer form="rect" intensity={2.5} position={[5, 1, 1]} rotation-y={-Math.PI / 2} scale={[0.6, 8, 1]} />
        <Lightformer form="rect" intensity={1.2} position={[0, -3, 4]} scale={[6, 1, 1]} />
        <Lightformer form="ring" intensity={1.5} color="#ffdb00" position={[3, 2, -4]} scale={2} />
        <Lightformer form="rect" intensity={0.8} position={[0, 0, -6]} scale={[10, 10, 1]} />
      </Environment>
      <Phone progress={progress} steps={steps} screens={screens} font={font} />
    </Canvas>
  );
}
