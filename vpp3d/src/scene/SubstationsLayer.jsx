import { useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';

// 변전소: 월드좌표 마커 (InstancedMesh — 1천개+도 가볍게)
export default function SubstationsLayer({ subs = [] }) {
  const ref = useRef();
  useLayoutEffect(() => {
    if (!ref.current) return;
    const m = new THREE.Matrix4();
    subs.forEach((s, i) => { m.makeTranslation(s.x, 0.12, s.z); ref.current.setMatrixAt(i, m); });
    ref.current.instanceMatrix.needsUpdate = true;
    ref.current.count = subs.length;
  }, [subs]);
  if (!subs.length) return null;
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, Math.max(1, subs.length)]} castShadow>
      <boxGeometry args={[0.13, 0.18, 0.13]} />
      <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.2} />
    </instancedMesh>
  );
}
