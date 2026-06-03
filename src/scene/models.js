import { useGLTF } from '@react-three/drei';

const B = import.meta.env.BASE_URL;
export const url = (f) => `${B}models/${f}.glb`;

// 타입별 사용할 Kenney 모델 풀
export const CITY = ['city-a', 'city-b', 'city-c', 'city-d', 'city-e', 'city-f', 'city-g', 'city-h'];
export const FACTORY = ['fac-tall', 'fac-high', 'fac-machine'];
export const TREES = ['tree', 'tree-dark'];

export const ALL_MODELS = [...CITY, ...FACTORY, ...TREES, 'fac-pipe'];

// 미리 로드 (스플래시 이후 즉시 표시)
ALL_MODELS.forEach((m) => useGLTF.preload(url(m)));

// 결정적 선택 (id 해시 기반) — 같은 객체는 항상 같은 모델
export function pickModel(pool, seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return pool[h % pool.length];
}
