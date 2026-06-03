import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import KenneyModel from './KenneyModel.jsx';
import Solar from './Solar.jsx';
import Wind from './Wind.jsx';
import Nuclear from './Nuclear.jsx';
import DataCenter from './DataCenter.jsx';
import Substation from './Substation.jsx';
import { CITY, FACTORY, pickModel } from './models.js';

// 파스텔 팔레트 (id 해시로 결정적 선택 → 같은 설비는 항상 같은 색)
const APT_COLORS = ['#fca5a5', '#fdba74', '#fcd34d', '#86efac', '#7dd3fc', '#c4b5fd', '#f9a8d4', '#a5f3fc'];
const FAC_COLORS = ['#fdba74', '#fb923c', '#f59e0b', '#94d2bd', '#a5b4fc'];

function hash(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h;
}
const pickColor = (pool, seed) => pool[hash(seed + 'c') % pool.length];

function Item({ o, sun, windFactor }) {
  const g = useRef();
  useFrame(() => {
    if (!g.current) return;
    const t = Math.min(1, (performance.now() - o.bornAt) / 380);
    const ease = 1 - Math.pow(1 - t, 3);
    g.current.scale.setScalar(o.scale * (0.2 + 0.8 * ease));
  });

  let inner;
  if (o.type === 'apt') inner = <KenneyModel name={pickModel(CITY, o.id)} targetH={0.7} tint={pickColor(APT_COLORS, o.id)} />;
  else if (o.type === 'factory') inner = <KenneyModel name={pickModel(FACTORY, o.id)} targetH={0.6} tint={pickColor(FAC_COLORS, o.id)} />;
  else if (o.type === 'solar') inner = <group scale={0.62}><Solar sun={sun} /></group>;
  else if (o.type === 'wind') inner = <group scale={0.6}><Wind windFactor={windFactor} /></group>;
  else if (o.type === 'nuclear') inner = <group scale={0.95}><Nuclear /></group>;
  else if (o.type === 'datacenter') inner = <group scale={0.32}><DataCenter /></group>;
  else if (o.type === 'substation') inner = <group scale={0.7}><Substation /></group>;

  return (
    <group ref={g} position={[o.pos[0], 0, o.pos[1]]} rotation={[0, o.rot, 0]}>
      {inner}
    </group>
  );
}

export default function Buildings({ objects, sun, windFactor }) {
  return (
    <group>
      {objects.map((o) => (
        <Item key={o.id} o={o} sun={sun} windFactor={windFactor} />
      ))}
    </group>
  );
}
