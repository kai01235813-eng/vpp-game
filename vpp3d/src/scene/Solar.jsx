import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

// 절차적 태양광 — 기둥 위 기울어진 패널, 햇빛 강도에 따라 발광
export default function Solar({ sun = 0 }) {
  const panel = useRef();
  const emissive = 0.05 + Math.max(0, sun) * 0.5;
  return (
    <group>
      {/* 다리 */}
      {[[-0.45, -0.3], [0.45, -0.3], [-0.45, 0.3], [0.45, 0.3]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.35, z]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.7, 8]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
      ))}
      {/* 패널 */}
      <group ref={panel} position={[0, 0.75, 0]} rotation={[-0.6, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.5, 0.08, 1.0]} />
          <meshStandardMaterial color="#1e3a8a" metalness={0.3} roughness={0.4} />
        </mesh>
        {/* 셀 격자 느낌 */}
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[1.35, 0.02, 0.85]} />
          <meshStandardMaterial color="#3b82f6" emissive="#60a5fa" emissiveIntensity={emissive} />
        </mesh>
      </group>
    </group>
  );
}
