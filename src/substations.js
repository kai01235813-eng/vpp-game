// 변전소 — 공식 개수(2025 935 → 2038 1,297)에 맞춰 남한 육지 전역에 연속 분포(부하밀도 가중)
// 출처: 한전 송변전/디지털변전소 현황(2025), KPX EPSIS
import { REGIONS } from './regions.js';
import { SK_OUTLINE, JEJU, toWorld, K } from './geo.js';

export const SUB_2025 = 935;
export const SUB_2038 = 1297;

const POLY = SK_OUTLINE.map(([la, lo]) => toWorld(la, lo));
const [JX, JZ] = toWorld(JEJU.lat, JEJU.lon);
const JR = JEJU.rx * K * 0.9;
const xs = POLY.map((p) => p[0]), zs = POLY.map((p) => p[1]);
const XMIN = Math.min(...xs) - 1, XMAX = Math.max(...xs) + 1;
const ZMIN = Math.min(...zs) - 1, ZMAX = Math.max(JZ + JR, Math.max(...zs)) + 1;

function inPoly(x, z) {
  let inside = false;
  for (let i = 0, j = POLY.length - 1; i < POLY.length; j = i++) {
    const [xi, zi] = POLY[i], [xj, zj] = POLY[j];
    if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) inside = !inside;
  }
  return inside;
}
const inJeju = (x, z) => (x - JX) ** 2 + (z - JZ) ** 2 < JR * JR;
const onLand = (x, z) => inPoly(x, z) || inJeju(x, z);

// 부하밀도 가중 (수도권 최다)
const W = { sudogwon: 27, gangwon: 5, chungbuk: 7, chungnam: 10, jeonbuk: 8, jeonnam: 10, gyeongbuk: 11, gyeongnam: 9, busanulsan: 13, jeju: 3 };
const MAXW = Math.max(...Object.values(W));

function nearestRegion(x, z) {
  let best = REGIONS[0], bd = Infinity;
  for (const r of REGIONS) { const d = (r.x - x) ** 2 + (r.z - z) ** 2; if (d < bd) { bd = d; best = r; } }
  return best;
}
function rng(seed) { let t = seed >>> 0; return () => { t += 0x6D2B79F5; let r = Math.imul(t ^ (t >>> 15), 1 | t); r ^= r + Math.imul(r ^ (r >>> 7), 61 | r); return ((r ^ (r >>> 14)) >>> 0) / 4294967296; }; }

export const SUB_POOL = (() => {
  const rand = rng(20381297);
  const out = [];
  let guard = 0;
  while (out.length < SUB_2038 && guard++ < 400000) {
    const x = XMIN + rand() * (XMAX - XMIN);
    const z = ZMIN + rand() * (ZMAX - ZMIN);
    if (!onLand(x, z)) continue;
    const reg = nearestRegion(x, z);
    const prob = 0.22 + 0.78 * (W[reg.id] / MAXW);
    if (rand() > prob) continue;
    out.push({ x, z, region: reg.id });
  }
  // 등장연도: 앞 935개는 2025, 이후는 2025~2038 분산 (배열 순서는 이미 무작위)
  out.forEach((s, i) => { s.appear = i < SUB_2025 ? 2025 : 2025 + ((i - SUB_2025 + 1) / (SUB_2038 - SUB_2025)) * 13; });
  return out;
})();

export function visibleSubsAt(year) {
  return SUB_POOL.filter((s) => s.appear <= year + 1e-6);
}
