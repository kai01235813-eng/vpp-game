import { useMemo, useState } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { DEMAND_HUBS, DEMAND_STYLE, toWorld } from '../geo.js';

function useGlowTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.45, 'rgba(255,255,255,0.6)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grad; g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);
}

function Hub({ h, tex }) {
  const [hover, setHover] = useState(false);
  const [x, z] = toWorld(h.lat, h.lon);
  const st = DEMAND_STYLE[h.type] || DEMAND_STYLE.semi;
  const r = 1.5 * h.size;
  return (
    <group position={[x, 0, z]} onPointerOver={(e) => { e.stopPropagation(); setHover(true); }} onPointerOut={() => setHover(false)}>
      {/* 전력수요 글로우 (진하게) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.07, 0]}>
        <planeGeometry args={[r * 2, r * 2]} />
        <meshBasicMaterial map={tex} color={st.color} transparent opacity={0.62} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
        <planeGeometry args={[r * 1.1, r * 1.1]} />
        <meshBasicMaterial map={tex} color={st.color} transparent opacity={0.55} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.17, 12, 12]} />
        <meshStandardMaterial color={st.color} emissive={st.color} emissiveIntensity={0.9} />
      </mesh>
      {hover && (
        <Html position={[0, 1.0, 0]} center distanceFactor={42} zIndexRange={[8, 0]}>
          <div style={{ font: '700 12px "Fredoka","Noto Sans KR"', whiteSpace: 'nowrap', color: '#334155', background: 'rgba(255,255,255,0.95)', border: `2px solid ${st.color}`, borderRadius: 12, padding: '3px 10px', pointerEvents: 'none', boxShadow: '0 6px 14px rgba(120,150,190,0.3)' }}>
            {st.icon} {h.name} <b style={{ color: st.color }}>{h.info}</b>
            <div style={{ fontSize: 9.5, color: '#94a3b8', fontWeight: 400 }}>{h.policy}</div>
          </div>
        </Html>
      )}
    </group>
  );
}

export default function DemandLayer({ year = 2025 }) {
  const tex = useGlowTexture();
  const hubs = DEMAND_HUBS.filter((h) => (h.from || 2025) <= year);
  return <group>{hubs.map((h) => <Hub key={h.name} h={h} tex={tex} />)}</group>;
}
