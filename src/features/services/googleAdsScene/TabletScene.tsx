"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import type { MotionValue } from "framer-motion";
import { roundedPlane, slab } from "@/lib/three/shapes";
import { grainTexture } from "@/lib/three/textures";

/*
 * A wide 16:10 Android tablet, landscape — Galaxy Tab S9 Ultra proportions:
 * 326.4 × 208.6 × 5.5 mm, in world units (1 = 125 mm), with the front
 * camera in a small notch on the long top edge. The wide screen suits our
 * wide recording, which fills its full height.
 */
const W = 2.611;
const H = 1.669;
const D = 0.044;
const R = 0.15; // corner radius
const BEZEL = 0.07;
const SW = W - BEZEL * 2;
const SH = H - BEZEL * 2;
// Dark graphite, bead-blasted aluminium.
const ALU = "#3d3e42";
const EDGE_DARK = "#0d0d0f";
/** Desk height (the tablet's resting centre when lying flat sits just above). */
const DESK = -0.95;

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Display glass: a soft diagonal sheen. */
function sheenTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 360;
  const g = c.getContext("2d")!;
  const grd = g.createLinearGradient(0, 0, 512, 360);
  grd.addColorStop(0, "rgba(255,255,255,0.14)");
  grd.addColorStop(0.3, "rgba(255,255,255,0.04)");
  grd.addColorStop(0.4, "rgba(255,255,255,0.1)");
  grd.addColorStop(0.5, "rgba(255,255,255,0)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 512, 360);
  return new THREE.CanvasTexture(c);
}

function Tablet({ progress, video }: { progress: MotionValue<number>; video: HTMLVideoElement }) {
  const body = useRef<THREE.Group>(null);
  const screen = useRef<THREE.MeshBasicMaterial>(null);
  const wantsPlay = useRef(false);
  const lastTime = useRef(-1);
  const { camera, size } = useThree();

  const frameGeo = useMemo(() => slab(W, H, R, D, 0.008), []);
  const glassGeo = useMemo(() => roundedPlane(W - 0.006, H - 0.006, R - 0.003), []);
  const screenGeo = useMemo(() => roundedPlane(SW, SH, R - BEZEL * 0.9), []);
  const backGeo = useMemo(() => roundedPlane(W - 0.01, H - 0.01, R - 0.005), []);
  const notchGeo = useMemo(() => roundedPlane(0.2, 0.06, 0.025), []);
  const sheen = useMemo(() => sheenTexture(), []);
  const grain = useMemo(() => grainTexture(), []);
  const penStripGeo = useMemo(() => roundedPlane(0.62, 0.09, 0.045), []);
  const alu = (rough: number) => (
    <meshPhysicalMaterial
      color={ALU}
      metalness={1}
      roughness={rough}
      roughnessMap={grain}
      bumpMap={grain}
      bumpScale={0.0006}
      clearcoat={0.12}
      clearcoatRoughness={0.45}
    />
  );

  // The recording drawn into a canvas at the display's ratio, filling its
  // height, refreshed while it plays.
  const screenTex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 1600;
    c.height = Math.round((1600 * SH) / SW);
    const g = c.getContext("2d")!;
    g.fillStyle = "#fff";
    g.fillRect(0, 0, c.width, c.height);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return { c, g, t };
  }, []);
  useEffect(() => () => screenTex.t.dispose(), [screenTex]);

  const target = useMemo(() => ({ cam: new THREE.Vector3(), look: new THREE.Vector3(), lookNow: new THREE.Vector3(0, -0.5, 0) }), []);

  useFrame((state, delta) => {
    const p = progress.get();
    const damp = 1 - Math.exp(-delta * 7);
    const time = state.clock.elapsedTime;

    // Face down on the desk → lifts, flips over and stands up to face you.
    const lift = smooth(0.05, 0.4, p);
    const flip = smooth(0.08, 0.6, p);
    const stand = smooth(0.35, 0.72, p);
    const settled = smooth(0.7, 0.8, p);
    const g = body.current;
    if (g) {
      // Lying face down (rotation.x +π/2, screen to the desk), it lifts and
      // swings up through a little arc to stand facing you.
      const want = new THREE.Euler(
        THREE.MathUtils.lerp(Math.PI / 2, -0.06, smooth(0.08, 0.72, p)) + Math.sin(flip * Math.PI) * 0.35,
        THREE.MathUtils.lerp(-0.7, 0, smooth(0.05, 0.72, p)) + Math.sin(time * 0.6) * 0.03 * settled,
        THREE.MathUtils.lerp(0.25, 0, flip) + Math.sin(flip * Math.PI) * 0.18,
      );
      g.rotation.x += (want.x - g.rotation.x) * damp;
      g.rotation.y += (want.y - g.rotation.y) * damp;
      g.rotation.z += (want.z - g.rotation.z) * damp;
      const y = THREE.MathUtils.lerp(DESK + D / 2 + 0.002, 0.05, lift) + Math.sin(flip * Math.PI) * 0.25 + Math.sin(time * 0.9) * 0.012 * settled;
      g.position.y += (y - g.position.y) * damp;
    }

    // Camera: high over the desk → square on to the standing tablet.
    // On the short phone frame the camera comes in closer so the tablet fills it.
    const aspect = size.width / size.height;
    const fit = aspect < 1.5 ? 0.82 : Math.max(1, 1.1 / aspect);
    const k = smooth(0.05, 0.75, p);
    target.cam.set(0, THREE.MathUtils.lerp(4.6, 0.25, k) * fit, THREE.MathUtils.lerp(4.2, 5.4, k) * fit);
    target.look.set(0, THREE.MathUtils.lerp(-0.8, 0.02, k), 0);
    camera.position.lerp(target.cam, damp);
    target.lookNow.lerp(target.look, damp);
    camera.lookAt(target.lookNow);

    // Screen wakes as it turns toward you; the recording starts from the top
    // once it's standing, and stops when it lies back down.
    if (screen.current) screen.current.color.setScalar(smooth(0.42, 0.62, p));
    if (stand > 0.97 && video.paused && !wantsPlay.current) {
      wantsPlay.current = true;
      video.currentTime = 0;
      void video.play().catch(() => {});
    } else if (stand < 0.9 && wantsPlay.current) {
      wantsPlay.current = false;
      video.pause();
    }
    if (video.readyState >= 2 && video.currentTime !== lastTime.current) {
      lastTime.current = video.currentTime;
      const { c, g: ctx, t } = screenTex;
      // Fill the screen's height; the extra width is trimmed, more from the
      // left (blurred account names) than the right (the figures).
      const w = (c.height * video.videoWidth) / video.videoHeight;
      ctx.drawImage(video, (c.width - w) * 0.66, 0, w, c.height);
      t.needsUpdate = true;
    }
  });

  return (
    <group ref={body} position={[0, DESK + D / 2, 0]} rotation={[Math.PI / 2, -0.7, 0.25]}>
      {/* Graphite aluminium body: flat edges, softly broken corners */}
      <mesh geometry={frameGeo} castShadow receiveShadow>
        {alu(0.4)}
      </mesh>
      {/* Front: black glass, the display, the camera notch, glass sheen */}
      <mesh geometry={glassGeo} position={[0, 0, D / 2 + 0.0006]}>
        <meshPhysicalMaterial color="#030304" roughness={0.08} metalness={0.2} clearcoat={1} />
      </mesh>
      <mesh geometry={screenGeo} position={[0, 0, D / 2 + 0.0012]}>
        <meshBasicMaterial ref={screen} map={screenTex.t} color="#000" toneMapped={false} />
      </mesh>
      <mesh geometry={notchGeo} position={[0, SH / 2 - 0.006, D / 2 + 0.0016]}>
        <meshBasicMaterial color="#030304" />
      </mesh>
      <mesh position={[0, SH / 2 - 0.006, D / 2 + 0.002]}>
        <circleGeometry args={[0.011, 24]} />
        <meshPhysicalMaterial color="#0d1424" roughness={0.05} metalness={0.6} clearcoat={1} />
      </mesh>
      <mesh position={[0, 0, D / 2 + 0.002]}>
        <planeGeometry args={[SW, SH]} />
        <meshBasicMaterial map={sheen} transparent depthWrite={false} toneMapped={false} />
      </mesh>
      {/* Back: aluminium, two bare camera rings (top-left seen from behind) */}
      <mesh geometry={backGeo} position={[0, 0, -D / 2 - 0.0006]} rotation={[0, Math.PI, 0]} receiveShadow>
        {alu(0.46)}
      </mesh>
      {/* Magnetic pen strip beside the cameras (glossy black glass) */}
      <mesh geometry={penStripGeo} position={[-0.12, H / 2 - 0.25, -D / 2 - 0.0012]} rotation={[0, Math.PI, 0]}>
        <meshPhysicalMaterial color="#121214" roughness={0.12} metalness={0.3} clearcoat={1} />
      </mesh>
      <group position={[W / 2 - 0.2, H / 2 - 0.25, -D / 2]} rotation={[0, Math.PI, 0]}>
        {[0, -0.17].map((y) => (
          <group key={y} position={[0, y, 0.004]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.06, 0.062, 0.008, 48]} />
              <meshPhysicalMaterial color="#2a2b2e" metalness={1} roughness={0.18} clearcoat={0.8} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.0045]}>
              <cylinderGeometry args={[0.045, 0.045, 0.002, 40]} />
              <meshPhysicalMaterial color="#05070c" roughness={0.04} metalness={0.6} clearcoat={1} />
            </mesh>
          </group>
        ))}
        <mesh position={[0.13, 0, 0.003]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.003, 24]} />
          <meshStandardMaterial color="#eae4d2" roughness={0.35} />
        </mesh>
      </group>
      {/* Speaker grilles drilled into both short edges (two per side) */}
      {[-1, 1].map((side) =>
        [-0.5, 0.5].map((y) =>
          Array.from({ length: 9 }, (_, i) => (
            <mesh key={`${side}${y}${i}`} position={[side * (W / 2 + 0.0004), y + (i - 4) * 0.028, 0]} rotation={[0, side * (Math.PI / 2), 0]}>
              <circleGeometry args={[0.0075, 12]} />
              <meshBasicMaterial color={EDGE_DARK} />
            </mesh>
          )),
        ),
      )}
      {/* Power and volume keys on the top edge, near the right */}
      {[
        { x: 0.62, w: 0.2 },
        { x: 0.95, w: 0.32 },
      ].map((k) => (
        <mesh key={k.x} position={[k.x, H / 2 + 0.006, 0]} castShadow>
          <boxGeometry args={[k.w, 0.012, D * 0.55]} />
          {alu(0.3)}
        </mesh>
      ))}
      {/* USB-C port on the right short edge */}
      <mesh position={[W / 2 + 0.0006, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.11, 0.028]} />
        <meshBasicMaterial color={EDGE_DARK} />
      </mesh>
      {/* Antenna lines across the edges */}
      {[
        [W / 2 + 0.0005, H / 2 - 0.22, Math.PI / 2],
        [W / 2 + 0.0005, -H / 2 + 0.22, Math.PI / 2],
        [-W / 2 - 0.0005, H / 2 - 0.22, -Math.PI / 2],
        [-W / 2 - 0.0005, -H / 2 + 0.22, -Math.PI / 2],
      ].map(([x, y, ry]) => (
        <mesh key={`${x}${y}`} position={[x, y, 0]} rotation={[0, ry, 0]}>
          <planeGeometry args={[D * 0.9, 0.008]} />
          <meshBasicMaterial color="#1b1b1e" />
        </mesh>
      ))}
      {/* Keyboard connector pins on the bottom edge */}
      {[-0.05, 0, 0.05].map((x) => (
        <mesh key={x} position={[x, -H / 2 - 0.0006, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.009, 16]} />
          <meshStandardMaterial color="#c9a85a" metalness={1} roughness={0.25} />
        </mesh>
      ))}
    </group>
  );
}

export default function TabletScene({ progress, src }: { progress: MotionValue<number>; src: { webm: string; mp4: string } }) {
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
    video.load();
    return () => {
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [video, src]);

  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 4.6, 4.2], fov: 30 }} gl={{ antialias: true, alpha: true }} aria-hidden>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2.5, 6, 3.5]} intensity={1.4} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-4, 3, 2]} intensity={0.45} />
      {/* Light studio reflections (no network HDRI), so the metal reads as aluminium. */}
      <Environment resolution={512} environmentIntensity={1}>
        <color attach="background" args={["#c9cbd1"]} />
        <Lightformer form="rect" intensity={3} position={[0, 5, 2]} rotation-x={Math.PI / 2} scale={[10, 4, 1]} />
        <Lightformer form="rect" intensity={2.4} position={[-5, 1.5, 1]} rotation-y={Math.PI / 2} scale={[0.5, 8, 1]} />
        <Lightformer form="rect" intensity={2.4} position={[5, 1.5, 1]} rotation-y={-Math.PI / 2} scale={[0.5, 8, 1]} />
        <Lightformer form="rect" intensity={1.6} position={[0, 1, 6]} scale={[8, 2, 1]} />
      </Environment>
      <Tablet progress={progress} video={video} />
      <ContactShadows position={[0, DESK - 0.002, 0]} opacity={0.4} scale={8} blur={2.4} far={2.2} resolution={1024} />
    </Canvas>
  );
}
