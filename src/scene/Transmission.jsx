import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { TRANSMISSION, toWorld } from '../geo.js';

function Seg({ a, b, color }) {
  const dx = b[0] - a[0], dz = b[1] - a[1];
  const len = Math.hypot(dx, dz);
  const ang = Math.atan2(dz, dx);
  return (
    <mesh position={[(a[0] + b[0]) / 2, 0.45, (a[1] + b[1]) / 2]} rotation={[0, -ang, 0]}>
      <boxGeometry args={[len, 0.12, 0.22]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
    </mesh>
  );
}

export default function Transmission({ year = 2025 }) {
  const flow = useRef(0);
  useFrame((_, dt) => { flow.current += dt; });
  return (
    <group>
      {TRANSMISSION.filter((l) => (l.from || 2025) <= year).map((line) => {
        const pts = line.path.map(([la, lo]) => toWorld(la, lo));
        const color = line.type === 'hvdc' ? '#22d3ee' : '#c084fc';
        return (
          <group key={line.name}>
            {pts.slice(1).map((p, i) => <Seg key={i} a={pts[i]} b={p} color={color} />)}
            {pts.map((p, i) => (
              <mesh key={'n' + i} position={[p[0], 0.45, p[1]]}>
                <sphereGeometry args={[0.18, 10, 10]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
}
