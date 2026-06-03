import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

// 절차적 데이터센터 — 어두운 서버동 + 깜빡이는 서버 LED
export default function DataCenter() {
  const leds = useRef();
  useFrame((_, dt) => {
    if (!leds.current) return;
    leds.current.children.forEach((m) => {
      if (Math.random() < 0.06) m.material.emissiveIntensity = Math.random() < 0.5 ? 0.2 : 1.6;
    });
  });
  const rows = 3, cols = 5;
  return (
    <group>
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 1.5, 1.3]} />
        <meshStandardMaterial color="#334155" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[1.9, 0.12, 1.4]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <group ref={leds} position={[0, 0, 0.66]}>
        {Array.from({ length: rows * cols }).map((_, i) => {
          const r = Math.floor(i / cols), c = i % cols;
          return (
            <mesh key={i} position={[-0.6 + c * 0.3, 0.45 + r * 0.32, 0]}>
              <boxGeometry args={[0.16, 0.16, 0.04]} />
              <meshStandardMaterial color="#0ea5e9" emissive="#38bdf8" emissiveIntensity={0.9} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}
