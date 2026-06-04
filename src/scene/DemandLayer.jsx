import { useMemo, useState } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { DEMAND_HUBS, DEMAND_STYLE, toWorld } from '../geo.js';

// 전력수요 규모(size) → 히트 색상 (노랑→주황→빨강)
function heat(size) {
  const t = Math.max(0, Math.min(1, (size - 1.3) / (3.0 - 1.3)));
  const c1 = [253, 224, 71], c2 = [249, 115, 22], c3 = [185, 28, 28];
  let a, b, tt;
  if (t < 0.5) { a = c1; b = c2; tt = t / 0.5; } else { a = c2; b = c3; tt = (t - 0.5) / 0.5; }
  const m = (i) => Math.round(a[i] + (b[i] - a[i]) * tt);
  return `rgb(${m(0)},${m(1)},${m(2)})`;
}
function sizeLabel(size) { return size >= 2.6 ? '초대형' : size >= 2.0 ? '대형' : size >= 1.6 ? '중대형' : '중형'; }

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

const FADE = 1.2;
const clamp01 = (v) => Math.max(0, Math.min(1, v));

function Hub({ h, tex, year }) {
  const [hover, setHover] = useState(false);
  const [x, z] = toWorld(h.lat, h.lon);
  const st = DEMAND_STYLE[h.type] || DEMAND_STYLE.semi;
  const col = heat(h.size);              // 색 = 전력수요 규모
  const p = clamp01((year - (h.from || 2025)) / FADE); // 점진 등장
  const r = 1.4 * h.size * (0.35 + 0.65 * p);
  const op = (0.5 + Math.min(0.28, (h.size - 1.3) * 0.18)) * p;
  return (
    <group position={[x, 0, z]} onPointerOver={(e) => { e.stopPropagation(); setHover(true); }} onPointerOut={() => setHover(false)}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.07, 0]}>
        <planeGeometry args={[r * 2, r * 2]} />
        <meshBasicMaterial map={tex} color={col} transparent opacity={op} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
        <planeGeometry args={[r * 1.05, r * 1.05]} />
        <meshBasicMaterial map={tex} color={col} transparent opacity={op * 0.9} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.2, 0]} scale={0.4 + 0.6 * p}>
        <sphereGeometry args={[0.16, 12, 12]} />
        <meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.9} />
      </mesh>
      {hover && (
        <Html position={[0, 1.0, 0]} center distanceFactor={42} zIndexRange={[8, 0]}>
          <div style={{ font: '700 12px "Fredoka","Noto Sans KR"', whiteSpace: 'nowrap', color: '#334155', background: 'rgba(255,255,255,0.96)', border: `2px solid ${col}`, borderRadius: 12, padding: '3px 10px', pointerEvents: 'none', boxShadow: '0 6px 14px rgba(120,150,190,0.3)' }}>
            <span style={{ background: col, color: '#fff', borderRadius: 6, padding: '0 5px', fontSize: 10, marginRight: 4 }}>{sizeLabel(h.size)} 수요</span>
            {st.icon} {h.name} <b style={{ color: st.color }}>{h.info}</b>
            <div style={{ fontSize: 9.5, color: '#94a3b8', fontWeight: 400 }}>{st.name} · {h.policy}</div>
          </div>
        </Html>
      )}
    </group>
  );
}

export default function DemandLayer({ year = 2025 }) {
  const tex = useGlowTexture();
  const hubs = DEMAND_HUBS.filter((h) => year >= (h.from || 2025) - 0.01);
  return <group>{hubs.map((h) => <Hub key={h.name} h={h} tex={tex} year={year} />)}</group>;
}
