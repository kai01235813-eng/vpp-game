import { useMemo } from 'react';
import * as THREE from 'three';
import { SK_OUTLINE, JEJU, toWorld, K } from '../geo.js';

function buildShape(worldPts, scale, cx, cz) {
  const sh = new THREE.Shape();
  worldPts.forEach(([x, z], i) => {
    const sx = cx + (x - cx) * scale, sz = cz + (z - cz) * scale;
    if (i === 0) sh.moveTo(sx, -sz); else sh.lineTo(sx, -sz);
  });
  sh.closePath();
  return sh;
}

export default function Korea() {
  const { main, coast } = useMemo(() => {
    const w = SK_OUTLINE.map(([la, lo]) => toWorld(la, lo));
    const cx = w.reduce((a, [x]) => a + x, 0) / w.length;
    const cz = w.reduce((a, [, z]) => a + z, 0) / w.length;
    return { main: buildShape(w, 1, cx, cz), coast: buildShape(w, 1.05, cx, cz) };
  }, []);
  const [jx, jz] = toWorld(JEJU.lat, JEJU.lon);

  return (
    <group>
      {/* 해안선 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <shapeGeometry args={[coast]} />
        <meshStandardMaterial color="#ecdfc0" />
      </mesh>
      {/* 본토 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} receiveShadow>
        <shapeGeometry args={[main]} />
        <meshStandardMaterial color="#b9f0a3" />
      </mesh>
      {/* 제주 */}
      <group position={[jx, 0, jz]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
          <circleGeometry args={[JEJU.rx * K * 1.1, 36]} />
          <meshStandardMaterial color="#ecdfc0" />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} receiveShadow>
          <circleGeometry args={[JEJU.rx * K * 0.92, 36]} />
          <meshStandardMaterial color="#b9f0a3" />
        </mesh>
      </group>
    </group>
  );
}
