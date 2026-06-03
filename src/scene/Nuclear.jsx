import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

// 절차적 원전 — 격납돔 + 냉각탑(증기)
export default function Nuclear() {
  const steam = useRef();
  useFrame((_, dt) => {
    if (!steam.current) return;
    steam.current.children.forEach((p, i) => {
      p.position.y += dt * 0.5;
      p.material.opacity = Math.max(0, 0.5 - p.position.y * 0.18);
      if (p.position.y > 2.6) { p.position.y = 1.7; p.material.opacity = 0.5; }
    });
  });
  return (
    <group>
      {/* 기단 */}
      <mesh position={[0, 0.1, 0]} receiveShadow castShadow>
        <boxGeometry args={[2.4, 0.2, 1.8]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>
      {/* 격납 돔 */}
      <group position={[-0.6, 0.2, 0]}>
        <mesh position={[0, 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 0.9, 20]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>
        <mesh position={[0, 0.9, 0]} castShadow>
          <sphereGeometry args={[0.5, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#5eead4" metalness={0.2} roughness={0.5} />
        </mesh>
      </group>
      {/* 냉각탑 */}
      <mesh position={[0.65, 0.95, 0]} castShadow>
        <cylinderGeometry args={[0.42, 0.62, 1.6, 20]} />
        <meshStandardMaterial color="#f1f5f9" />
      </mesh>
      {/* 증기 */}
      <group ref={steam} position={[0.65, 0, 0]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0, 1.7 + i * 0.3, 0]}>
            <sphereGeometry args={[0.3, 10, 10]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.45} depthWrite={false} />
          </mesh>
        ))}
      </group>
      {/* 라벨 발광 */}
      <mesh position={[-0.6, 1.5, 0.0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#2dd4bf" emissive="#2dd4bf" emissiveIntensity={1.2} />
      </mesh>
    </group>
  );
}
