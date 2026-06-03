import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 비 파티클 (남한 상공)
export default function Rain({ active }) {
  const ref = useRef();
  const N = 700;
  const pos = useMemo(() => {
    const a = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      a[i * 3] = (Math.random() - 0.5) * 44;
      a[i * 3 + 1] = Math.random() * 26;
      a[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return a;
  }, []);
  useFrame((_, dt) => {
    if (!active || !ref.current) return;
    const arr = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < N; i++) {
      arr[i * 3 + 1] -= dt * 30;
      if (arr[i * 3 + 1] < 0) arr[i * 3 + 1] = 26;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });
  if (!active) return null;
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={N} array={pos} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#93c5fd" size={0.16} transparent opacity={0.6} depthWrite={false} />
    </points>
  );
}
