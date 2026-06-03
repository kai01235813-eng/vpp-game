import { useMemo } from 'react';
import Plant from './Plant.jsx';
import { toWorld } from '../geo.js';

export default function PlantsLayer({ plants = [] }) {
  const placed = useMemo(() => plants.map((p, i) => {
    const [x, z] = toWorld(p.lat, p.lon);
    return { ...p, x, z, key: p.name || `p${i}` };
  }), [plants]);
  return (
    <group>
      {placed.map((p) => (
        <group key={p.key} position={[p.x, 0, p.z]}>
          <Plant source={p.source} label={p.name} />
        </group>
      ))}
    </group>
  );
}
