import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

// 절차적 풍력터빈 — 타워 + 나셀 + 3엽 블레이드(회전)
export default function Wind({ windFactor = 0.6 }) {
  const hub = useRef();
  useFrame((_, dt) => {
    if (hub.current) hub.current.rotation.z += dt * (1.2 + windFactor * 2.5);
  });
  return (
    <group>
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.2, 2.8, 12]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <group position={[0, 2.8, 0]}>
        <mesh position={[0, 0, 0.15]} castShadow>
          <boxGeometry args={[0.45, 0.35, 0.7]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>
        <group ref={hub} position={[0, 0, 0.5]}>
          <mesh>
            <cylinderGeometry args={[0.12, 0.12, 0.2, 10]} />
            <meshStandardMaterial color="#cbd5e1" />
          </mesh>
          {[0, 1, 2].map((i) => (
            <group key={i} rotation={[0, 0, (i * Math.PI * 2) / 3]}>
              <mesh position={[0, 0.9, 0]} castShadow>
                <boxGeometry args={[0.12, 1.8, 0.04]} />
                <meshStandardMaterial color="#ffffff" />
              </mesh>
            </group>
          ))}
        </group>
      </group>
    </group>
  );
}
