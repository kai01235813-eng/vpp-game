import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { TRANSMISSION, toWorld } from '../geo.js';

const FADE = 1.2;
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const SUDOGWON = toWorld(37.45, 127.0); // 수요 중심(수도권)

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

// 폴리라인 위 fraction u(0~1) 위치 샘플
function sampleAt(pts, lens, total, u) {
  const target = u * total;
  let acc = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    if (acc + lens[i] >= target) {
      const f = lens[i] ? (target - acc) / lens[i] : 0;
      return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f];
    }
    acc += lens[i];
  }
  return pts[pts.length - 1];
}

// 전력 흐름 입자 (수도권 방향으로 이동)
function FlowDots({ pts, color, alpha, speed }) {
  const N = 4;
  const refs = useRef([]);
  const { lens, total } = useMemo(() => {
    const l = []; let t = 0;
    for (let i = 0; i < pts.length - 1; i++) { const d = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); l.push(d); t += d; }
    return { lens: l, total: t };
  }, [pts]);
  useFrame((state) => {
    const time = state.clock.elapsedTime * speed;
    for (let i = 0; i < N; i++) {
      const u = (time + i / N) % 1;
      const [x, z] = sampleAt(pts, lens, total, u);
      const m = refs.current[i];
      if (m) m.position.set(x, 0.56, z);
    }
  });
  return (
    <>
      {Array.from({ length: N }).map((_, i) => (
        <mesh key={i} ref={(el) => (refs.current[i] = el)}>
          <sphereGeometry args={[0.17, 10, 10]} />
          <meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={1.4} transparent opacity={alpha} depthWrite={false} />
        </mesh>
      ))}
    </>
  );
}

// 수도권에 더 가까운 끝점이 마지막(=흐름 도착점)이 되도록 정렬
function orderToward(pts) {
  const d = (p) => (p[0] - SUDOGWON[0]) ** 2 + (p[1] - SUDOGWON[1]) ** 2;
  return d(pts[0]) < d(pts[pts.length - 1]) ? [...pts].reverse() : pts;
}

export default function Transmission({ year = 2025 }) {
  return (
    <group>
      {TRANSMISSION.map((line) => {
        const p = clamp01((year - (line.from || 2025)) / FADE);
        if (p <= 0.001) return null;
        const raw = line.path.map(([la, lo]) => toWorld(la, lo));
        const flow = orderToward(raw);
        const color = line.type === 'hvdc' ? '#22d3ee' : '#c084fc';
        const speed = line.type === 'hvdc' ? 0.14 : 0.1;
        return (
          <group key={line.name}>
            {raw.slice(1).map((pt, i) => <Seg key={i} a={raw[i]} b={pt} color={color} alpha={p} />)}
            {raw.map((pt, i) => (
              <mesh key={'n' + i} position={[pt[0], 0.45, pt[1]]} scale={0.5 + 0.5 * p}>
                <sphereGeometry args={[0.18, 10, 10]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8 * p} transparent opacity={p} depthWrite={false} />
              </mesh>
            ))}
            {p > 0.5 && <FlowDots pts={flow} color={color} alpha={p} speed={speed} />}
          </group>
        );
      })}
    </group>
  );
}
