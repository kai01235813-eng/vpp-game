import { useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';

const FADE = 1.0;
const clamp01 = (v) => Math.max(0, Math.min(1, v));

function Inst({ subs, color, h = 0.18, emissive = 0.22, year, fade }) {
  const ref = useRef();
  useLayoutEffect(() => {
    if (!ref.current) return;
    const m = new THREE.Matrix4();
    subs.forEach((s, i) => {
      const sc = fade ? Math.max(0.001, clamp01((year - s.appear) / FADE)) : 1;
      m.makeScale(1, sc, 1);
      m.setPosition(s.x, (h * sc) / 2 + 0.03, s.z);
      ref.current.setMatrixAt(i, m);
    });
    ref.current.instanceMatrix.needsUpdate = true;
    ref.current.count = subs.length;
  }, [subs, h, fade, year]);
  if (!subs.length) return null;
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, Math.max(1, subs.length)]} castShadow>
      <boxGeometry args={[0.13, h, 0.13]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={emissive} />
    </instancedMesh>
  );
}

// 변전소: 기존(주황) 고정 / 신설(빨강)은 등장 연도 기준 서서히 성장
export default function SubstationsLayer({ subs = [], year = 2025 }) {
  const existing = subs.filter((s) => s.appear <= 2025.001);
  const fresh = subs.filter((s) => s.appear > 2025.001);
  return (
    <group>
      <Inst subs={existing} color="#f59e0b" h={0.16} emissive={0.18} />
      <Inst subs={fresh} color="#ef4444" h={0.26} emissive={0.7} year={year} fade />
    </group>
  );
}
