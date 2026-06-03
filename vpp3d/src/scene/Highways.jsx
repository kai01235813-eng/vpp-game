import { HIGHWAYS, toWorld } from '../geo.js';

function Road({ a, b }) {
  const dx = b[0] - a[0], dz = b[1] - a[1];
  const len = Math.hypot(dx, dz);
  const ang = Math.atan2(dz, dx);
  return (
    <mesh position={[(a[0] + b[0]) / 2, 0.07, (a[1] + b[1]) / 2]} rotation={[0, -ang, 0]}>
      <boxGeometry args={[len, 0.04, 0.12]} />
      <meshStandardMaterial color="#b6a48a" />
    </mesh>
  );
}

export default function Highways() {
  return (
    <group>
      {HIGHWAYS.map((hw) => {
        const pts = hw.path.map(([la, lo]) => toWorld(la, lo));
        return pts.slice(1).map((p, i) => <Road key={hw.name + i} a={pts[i]} b={p} />);
      })}
    </group>
  );
}
