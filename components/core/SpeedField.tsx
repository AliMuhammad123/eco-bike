"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * WebGL speed field — thousands of light streaks rushing past the camera,
 * giving the hero the feeling of motion through a city at night.
 * `speedRef.current` (0..1) can be driven from scroll.
 */
function Streaks({ count, speedRef }: { count: number; speedRef: React.MutableRefObject<number> }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const data = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.5 + Math.random() * 14;
      arr.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius * 0.55,
        z: -Math.random() * 120,
        len: 0.6 + Math.random() * 2.8,
        v: 0.6 + Math.random() * 1.4,
      });
    }
    return arr;
  }, [count]);

  const colors = useMemo(() => {
    const c = new Float32Array(count * 3);
    const lime = new THREE.Color("#C8FF2E");
    const ion = new THREE.Color("#4DE8FF");
    const warm = new THREE.Color("#FFD9A0");
    for (let i = 0; i < count; i++) {
      const col = i % 9 === 0 ? lime : i % 4 === 0 ? warm : ion;
      col.toArray(c, i * 3);
    }
    return c;
  }, [count]);

  useEffect(() => {
    if (!mesh.current) return;
    mesh.current.geometry.setAttribute("color", new THREE.InstancedBufferAttribute(colors, 3));
  }, [colors]);

  useFrame((_, dt) => {
    const m = mesh.current;
    if (!m) return;
    const s = 18 + speedRef.current * 70;
    for (let i = 0; i < count; i++) {
      const d = data[i];
      d.z += d.v * s * Math.min(dt, 0.05);
      if (d.z > 4) d.z = -120;
      dummy.position.set(d.x, d.y, d.z);
      dummy.scale.set(1, 1, d.len * (1 + speedRef.current * 3));
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.018, 0.018, 1]} />
      <meshBasicMaterial vertexColors transparent opacity={0.75} blending={THREE.AdditiveBlending} depthWrite={false} />
    </instancedMesh>
  );
}

export default function SpeedField({ speedRef, count = 900 }: { speedRef: React.MutableRefObject<number>; count?: number }) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 5], fov: 70 }}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
    >
      <fog attach="fog" args={["#050607", 20, 110]} />
      <Streaks count={count} speedRef={speedRef} />
    </Canvas>
  );
}
