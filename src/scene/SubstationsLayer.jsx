import { useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';

function Inst({ subs, color, h = 0.18, emissive = 0.22 }) {
  const ref = useRef();
  useLayoutEffect(() => {
    if (!ref.current) return;
    const m = new THREE.Matrix4();
    subs.forEach((s, i) => { m.makeTranslation(s.x, h / 2 + 0.03, s.z); ref.current.setMatrixAt(i, m); });
    ref.current.instanceMatrix.needsUpdate = true;
    ref.current.count = subs.length;
  }, [subs, h]);
  if (!subs.length) return null;
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, Math.max(1, subs.length)]} castShadow>
      <boxGeometry args={[0.13, h, 0.13]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={emissive} />
    </instancedMesh>
  );
}

// 변전소: 기존(2025, 주황) vs 신설(2025 이후, 빨강) 색 구분 → 연도별 변화 직관적
export default function SubstationsLayer({ subs = [] }) {
  const existing = subs.filter((s) => s.appear <= 2025.001);
  const fresh = subs.filter((s) => s.appear > 2025.001);
  return (
    <group>
      <Inst subs={existing} color="#f59e0b" h={0.16} emissive={0.18} />
      <Inst subs={fresh} color="#ef4444" h={0.26} emissive={0.7} />
    </group>
  );
}
