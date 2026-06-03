import { useMemo } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

// 월드 좌표 [x,z] (z=남쪽+). rotateX(-90°) 규약: shape (x, -z)
function landShape(pts) {
  const sh = new THREE.Shape();
  pts.forEach(([x, z], i) => (i ? sh.lineTo(x, -z) : sh.moveTo(x, -z)));
  sh.closePath();
  return sh;
}
function Land({ pts, color, y = -0.1 }) {
  const shape = useMemo(() => landShape(pts), [pts]);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} receiveShadow>
      <shapeGeometry args={[shape]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
function Label({ text, x, z, size = 13, op = 0.6 }) {
  return (
    <Html position={[x, 1, z]} center distanceFactor={120} zIndexRange={[3, 0]}>
      <div style={{ font: `700 ${size}px "Fredoka","Noto Sans KR"`, color: '#94a3b8', whiteSpace: 'nowrap', opacity: op, pointerEvents: 'none' }}>{text}</div>
    </Html>
  );
}

// ── 대략적 전세계 (게임용 단순화, 남한 중심 배치) ──
const ASIA = [
  [-30, -20], [-26, -2], [-30, 16], [-44, 30], [-70, 42], [-95, 60],
  [-120, 40], [-140, 10], [-150, -30], [-130, -70], [-80, -95],
  [-20, -90], [15, -70], [10, -45], [-8, -30], [-18, -22],
];
const NORTH_KOREA = [
  [-12, -14], [-4, -15], [4, -14], [11, -15], [13, -21], [11, -29],
  [4, -34], [-4, -34], [-11, -31], [-15, -23], [-13, -17],
];
const JAPAN_HONSHU = [[21, -4], [27, -12], [34, -19], [41, -23], [44, -19], [38, -12], [30, -4], [24, 4]];
const JAPAN_SW = [[17, 9], [22, 5], [29, 9], [27, 16], [19, 16]];
const JAPAN_HOKKAIDO = [[38, -26], [45, -29], [46, -36], [39, -35]];
const SEASIA = [[-34, 74], [-12, 70], [-2, 86], [-22, 96], [-44, 90]];
const AUSTRALIA = [[58, 100], [98, 95], [118, 116], [100, 142], [60, 138], [48, 118]];
const EUROPE = [[-150, -95], [-118, -106], [-108, -68], [-132, -44], [-162, -50], [-172, -82]];
const AFRICA = [[-130, -6], [-98, 6], [-92, 46], [-110, 98], [-142, 112], [-158, 60], [-150, 14]];
const N_AMERICA = [[165, -92], [212, -102], [236, -54], [220, -8], [184, -14], [158, -52]];
const S_AMERICA = [[196, 30], [222, 24], [238, 72], [214, 132], [194, 110], [188, 58]];

export default function World() {
  return (
    <group>
      <Land pts={ASIA} color="#d3dac9" />
      <Land pts={EUROPE} color="#d5dccb" />
      <Land pts={AFRICA} color="#dcd6c0" />
      <Land pts={AUSTRALIA} color="#dbd3bd" />
      <Land pts={N_AMERICA} color="#d4dbca" />
      <Land pts={S_AMERICA} color="#d8d2bc" />
      <Land pts={SEASIA} color="#d6dcc6" />
      {/* 동아시아 근경 */}
      <Land pts={NORTH_KOREA} color="#c6d6bd" y={-0.06} />
      <Land pts={JAPAN_HONSHU} color="#d8d4c2" y={-0.06} />
      <Land pts={JAPAN_SW} color="#d8d4c2" y={-0.06} />
      <Land pts={JAPAN_HOKKAIDO} color="#d8d4c2" y={-0.06} />

      <Label text="아시아" x={-70} z={-30} size={18} />
      <Label text="유럽" x={-145} z={-72} size={16} />
      <Label text="아프리카" x={-128} z={55} size={16} />
      <Label text="오세아니아" x={84} z={120} size={15} />
      <Label text="북아메리카" x={198} z={-58} size={15} />
      <Label text="남아메리카" x={212} z={78} size={15} />
      <Label text="일본" x={33} z={-12} size={12} op={0.7} />
      <Label text="북한" x={-2} z={-24} size={12} op={0.7} />
    </group>
  );
}
