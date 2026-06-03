import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { PLANT_STYLE } from '../geo.js';

// 소형 발전소 모델 (실제 좌표에 배치) — 종류별 형태
export default function Plant({ source = 'other', label }) {
  const st = PLANT_STYLE[source] || PLANT_STYLE.other;
  const blade = useRef();
  useFrame((_, dt) => { if (blade.current) blade.current.rotation.z += dt * 1.6; });

  let body;
  if (source === 'nuclear') body = (
    <group>
      <mesh position={[0, 0.18, 0]} castShadow><cylinderGeometry args={[0.22, 0.22, 0.36, 16]} /><meshStandardMaterial color="#e2e8f0" /></mesh>
      <mesh position={[0, 0.36, 0]} castShadow><sphereGeometry args={[0.22, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#5eead4" /></mesh>
    </group>
  );
  else if (source === 'coal') body = (
    <group>
      <mesh position={[0, 0.18, 0]} castShadow><boxGeometry args={[0.5, 0.36, 0.4]} /><meshStandardMaterial color="#6b7280" /></mesh>
      {[-0.12, 0.12].map((x, i) => <mesh key={i} position={[x, 0.5, 0]} castShadow><cylinderGeometry args={[0.05, 0.06, 0.4, 8]} /><meshStandardMaterial color="#9ca3af" /></mesh>)}
    </group>
  );
  else if (source === 'gas') body = (
    <group>
      <mesh position={[0, 0.16, 0]} castShadow><boxGeometry args={[0.46, 0.32, 0.36]} /><meshStandardMaterial color="#fb923c" /></mesh>
      <mesh position={[0.12, 0.46, 0]} castShadow><cylinderGeometry args={[0.05, 0.05, 0.36, 8]} /><meshStandardMaterial color="#fdba74" /></mesh>
    </group>
  );
  else if (source === 'solar') body = (
    <group rotation={[-0.5, 0, 0]} position={[0, 0.18, 0]}><mesh castShadow><boxGeometry args={[0.5, 0.04, 0.34]} /><meshStandardMaterial color="#1e3a8a" emissive="#3b82f6" emissiveIntensity={0.25} /></mesh></group>
  );
  else if (source === 'wind') body = (
    <group>
      <mesh position={[0, 0.3, 0]} castShadow><cylinderGeometry args={[0.03, 0.05, 0.6, 8]} /><meshStandardMaterial color="#f8fafc" /></mesh>
      <group ref={blade} position={[0, 0.6, 0.04]}>{[0, 1, 2].map((i) => <group key={i} rotation={[0, 0, (i * Math.PI * 2) / 3]}><mesh position={[0, 0.16, 0]}><boxGeometry args={[0.03, 0.32, 0.02]} /><meshStandardMaterial color="#fff" /></mesh></group>)}</group>
    </group>
  );
  else if (source === 'hydro') body = (
    <mesh position={[0, 0.14, 0]} castShadow><boxGeometry args={[0.44, 0.28, 0.34]} /><meshStandardMaterial color="#22d3ee" /></mesh>
  );
  else body = <mesh position={[0, 0.14, 0]} castShadow><boxGeometry args={[0.36, 0.28, 0.3]} /><meshStandardMaterial color={st.color} /></mesh>;

  return (
    <group>
      {/* 종류 색 베이스 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}><circleGeometry args={[0.42, 24]} /><meshStandardMaterial color={st.color} transparent opacity={0.5} /></mesh>
      {body}
      <Html position={[0, 0.95, 0]} center distanceFactor={42} zIndexRange={[6, 0]}>
        <div style={{ font: '700 11px "Fredoka","Noto Sans KR"', whiteSpace: 'nowrap', color: '#334155', background: 'rgba(255,255,255,0.85)', border: `1.5px solid ${st.color}`, borderRadius: 999, padding: '1px 7px', pointerEvents: 'none' }}>{st.icon} {label || st.name}</div>
      </Html>
    </group>
  );
}
