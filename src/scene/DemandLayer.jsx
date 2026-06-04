import { useMemo } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { DEMAND_HUBS, DEMAND_STYLE, toWorld } from '../geo.js';

// 부드러운 방사형 글로우 텍스처 (1회 생성)
function useGlowTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255,255,255,0.95)');
    grad.addColorStop(0.4, 'rgba(255,255,255,0.45)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grad; g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);
}

export default function DemandLayer({ year = 2025 }) {
  const tex = useGlowTexture();
  const hubs = DEMAND_HUBS.filter((h) => (h.from || 2025) <= year);
  return (
    <group>
      {hubs.map((h) => {
        const [x, z] = toWorld(h.lat, h.lon);
        const st = DEMAND_STYLE[h.type] || DEMAND_STYLE.semi;
        const r = 1.6 * h.size;
        return (
          <group key={h.name} position={[x, 0, z]}>
            {/* 전력수요 글로우 (지면, 반투명) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.07, 0]}>
              <planeGeometry args={[r * 2, r * 2]} />
              <meshBasicMaterial map={tex} color={st.color} transparent opacity={0.42} depthWrite={false} />
            </mesh>
            {/* 코어 점 */}
            <mesh position={[0, 0.18, 0]}>
              <sphereGeometry args={[0.16, 12, 12]} />
              <meshStandardMaterial color={st.color} emissive={st.color} emissiveIntensity={0.7} />
            </mesh>
            {/* 라벨 (정책 기반 수요) */}
            <Html position={[0, 0.9, 0]} center distanceFactor={48} zIndexRange={[7, 0]}>
              <div style={{ font: '700 11px "Fredoka","Noto Sans KR"', whiteSpace: 'nowrap', color: '#334155', background: 'rgba(255,255,255,0.9)', border: `1.5px solid ${st.color}`, borderRadius: 999, padding: '1px 8px', pointerEvents: 'none', boxShadow: '0 4px 10px rgba(120,150,190,0.2)' }}>
                {st.icon} {h.name} <b style={{ color: st.color }}>{h.info}</b>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
