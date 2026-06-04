import { TRANSMISSION, toWorld } from '../geo.js';

const FADE = 1.2; // 등장 페이드 기간(년)
const clamp01 = (v) => Math.max(0, Math.min(1, v));

function Seg({ a, b, color, alpha }) {
  const dx = b[0] - a[0], dz = b[1] - a[1];
  const len = Math.hypot(dx, dz);
  const ang = Math.atan2(dz, dx);
  return (
    <mesh position={[(a[0] + b[0]) / 2, 0.45, (a[1] + b[1]) / 2]} rotation={[0, -ang, 0]}>
      <boxGeometry args={[len, 0.12, 0.22]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5 * alpha} transparent opacity={alpha} depthWrite={false} />
    </mesh>
  );
}

export default function Transmission({ year = 2025 }) {
  return (
    <group>
      {TRANSMISSION.map((line) => {
        const p = clamp01((year - (line.from || 2025)) / FADE);
        if (p <= 0.001) return null;
        const pts = line.path.map(([la, lo]) => toWorld(la, lo));
        const color = line.type === 'hvdc' ? '#22d3ee' : '#c084fc';
        return (
          <group key={line.name}>
            {pts.slice(1).map((pt, i) => <Seg key={i} a={pts[i]} b={pt} color={color} alpha={p} />)}
            {pts.map((pt, i) => (
              <mesh key={'n' + i} position={[pt[0], 0.45, pt[1]]} scale={0.5 + 0.5 * p}>
                <sphereGeometry args={[0.18, 10, 10]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8 * p} transparent opacity={p} depthWrite={false} />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
}
