// 2025 → 2038 설비 빌드아웃 — 제11차 전력수급기본계획 + 제11차 장기 송변전설비계획 기반
// ⚠️ 헤드라인 수치(GW/비중/변전소 수)는 계획 공식 수치, 3D 설비 배치는 시각화를 위한 대표 표현
import { REGIONS, regionById } from './regions.js';

export const START_YEAR = 2025;
export const END_YEAR = 2038;

export const PLAN = {
  title: '제11차 전력수급기본계획',
  sub: '산업부 확정 2025.2 · 한전 장기 송변전설비계획',
  note: '수치는 계획 공식값, 설비 배치는 시각화용 대표 표현',
};

// 권역별 2025 현황(대표) — 부하/설비 분포 반영
const BASE = {
  sudogwon:  { apt: 6, factory: 1, datacenter: 1 },
  gangwon:   { apt: 1, factory: 1 },
  chungbuk:  { apt: 2, factory: 2 },
  chungnam:  { factory: 3, apt: 1 },
  jeonbuk:   { apt: 1, factory: 1 },
  jeonnam:   { factory: 2, apt: 1 },
  gyeongbuk: { factory: 2, apt: 1 },
  gyeongnam: { factory: 2, apt: 1 },
  busanulsan:{ apt: 3, factory: 3 },
  jeju:      { apt: 1 },
};
// 권역별 2038 목표(대표) — 11차 계획: 호남 태양광·해상풍력, 수도권 데이터센터(용인), 해안 원전
const TGT = {
  sudogwon:  { apt: 9, factory: 1, datacenter: 4 },
  gangwon:   { apt: 1, factory: 1 },
  chungbuk:  { apt: 3, factory: 3 },
  chungnam:  { factory: 4, apt: 2, datacenter: 1 },
  jeonbuk:   { apt: 1, factory: 2 },
  jeonnam:   { factory: 3, apt: 1 },
  gyeongbuk: { factory: 3, apt: 1 },
  gyeongnam: { factory: 3, apt: 1 },
  busanulsan:{ apt: 4, factory: 4, datacenter: 1 },
  jeju:      { apt: 1 },
};

function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function rng(seed) { let t = seed >>> 0; return () => { t += 0x6D2B79F5; let r = Math.imul(t ^ (t >>> 15), 1 | t); r ^= r + Math.imul(r ^ (r >>> 7), 61 | r); return ((r ^ (r >>> 14)) >>> 0) / 4294967296; }; }

// 전체 2038 객체 풀 (결정적) — 각 객체에 등장연도 부여
export const POOL = (() => {
  const out = [];
  for (const region of REGIONS) {
    const base = BASE[region.id] || {}, tgt = TGT[region.id] || {};
    const types = new Set([...Object.keys(base), ...Object.keys(tgt)]);
    for (const type of types) {
      const c0 = base[type] || 0;
      const c1 = Math.max(c0, tgt[type] || 0);
      for (let i = 0; i < c1; i++) {
        const r = rng(hash(region.id + type + i));
        const ang = r() * Math.PI * 2;
        const rad = Math.sqrt(r()) * region.r;
        const x = region.x + Math.cos(ang) * rad;
        const z = region.z + Math.sin(ang) * rad;
        const appear = i < c0 ? START_YEAR : START_YEAR + ((i - c0 + 1) / (c1 - c0)) * (END_YEAR - START_YEAR);
        out.push({ id: `${region.id}-${type}-${i}`, type, region: region.id, pos: [x, z], rot: r() * Math.PI * 2, scale: 0.9 + r() * 0.25, phase: r() * 10, appear, bornAt: 0 });
      }
    }
  }
  return out;
})();

export function visibleAt(year) {
  return POOL.filter((o) => o.appear <= year + 1e-6);
}

const lerp = (a, b, t) => a + (b - a) * t;
// 제11차 전력수급기본계획 공식 헤드라인 수치 (연도 보간)
export function statsAt(year) {
  const t = Math.max(0, Math.min(1, (year - START_YEAR) / (END_YEAR - START_YEAR)));
  return {
    year,
    renewGW: lerp(39, 121.9, t),     // 신재생 설비용량 (2025 39GW → 2038 121.9GW)
    solarGW: lerp(28, 77.2, t),      // 태양광 77.2GW
    windGW: lerp(5.5, 40.7, t),      // 풍력 40.7GW
    demandGW: lerp(102, 128.9, t),   // 최대전력수요 128.9GW
    nuclearShare: lerp(30, 35.6, t), // 원전 발전비중 35.6%
    cfeShare: lerp(39.1, 70.7, t),   // 무탄소에너지 비중 70.7%
    substations: Math.round(lerp(935, 1297, t)), // 변전소 (2025 935 → 2038 1,297)
  };
}

// 연도별 마일스톤 (계획 기반)
export const MILESTONES = [
  { year: 2025, text: '수소특화단지 첫 지정 — 강원 동해·삼척(액화수소 저장), 경북 포항(연료전지)', src: '산업부 수소특화단지' },
  { year: 2025, text: '분산에너지 특화지역 후보 7곳 — 의왕·포항·부산·제주·울산·해남·서산', src: '산업부 분산에너지' },
  { year: 2026, text: '전북 새만금 그린수소 클러스터(100MW 수전해) 본격화', src: '전북도·산업부' },
  { year: 2027, text: '수도권 동서울변전소 옥내화·변환소 증설', src: '한전 송변전설비계획' },
  { year: 2028, text: '경북 포항 발전용 연료전지 클러스터 준공', src: '산업부·경북도' },
  { year: 2030, text: '서해안 에너지고속도로(HVDC) 단계 준공 — 서해안 재생E를 수도권으로', src: '한전 에너지고속도로' },
  { year: 2031, text: '호남–수도권 HVDC 1차 루트 준공 (2GW, 해저직결)', src: '11차 송변전설비계획' },
  { year: 2032, text: '용인 반도체 클러스터 가동 — 수도권 +15GW(국가산단9+일반6)', src: '용인시·한전' },
  { year: 2034, text: '전남 신안 해상풍력 대규모 단계 — 원전 6~8기급', src: '전라남도' },
  { year: 2035, text: '신안 8.2GW 해상풍력 완성 목표 (48조원, 세계 최대)', src: '전라남도' },
  { year: 2036, text: '노후 석탄 전면 폐지→LNG 전환 · 호남–수도권 HVDC 2차 루트', src: '11차 전력수급기본계획' },
  { year: 2037, text: '신규 대형원전 가동 (경북 울진·부울)', src: '11차 전력수급기본계획' },
  { year: 2038, text: '무탄소 70% 달성 · HVDC 4루트 완성 → 2040년대 U자형 에너지고속도로로 확장', src: '11차 전력수급기본계획' },
];

// 시기별 단계 (국가 정책 안내판용)
export const PHASES = [
  { y: 2025, name: '기반 구축기', desc: '수소특화단지·분산에너지 특화지역 지정, 노후 석탄 감축 시작' },
  { y: 2028, name: '재생에너지 확대기', desc: '서해안 에너지고속도로 착수, 새만금·신안 태양광·해상풍력 확대' },
  { y: 2031, name: 'HVDC·첨단수요 진입기', desc: '호남–수도권 HVDC 1차 준공, 용인 반도체 클러스터 가동(수요 급증)' },
  { y: 2034, name: '해상풍력·석탄종료기', desc: '신안 8.2GW 해상풍력 본격화, 노후 석탄 전면 폐지→LNG 전환' },
  { y: 2037, name: '무탄소 도약·U자 계통기', desc: '신규 대형원전 가동, 무탄소 70%, U자형 에너지고속도로 형성(→2040년대 완성)' },
];
export function phaseAt(year) { let p = PHASES[0]; for (const ph of PHASES) if (year >= ph.y) p = ph; return p; }
export function uStage(year) {
  if (year < 2030) return { label: '계획·준비 단계', pct: 8 };
  if (year < 2031) return { label: '서해안 에너지고속도로 착수', pct: 30 };
  if (year < 2036) return { label: '서해안 + 호남–수도권 직결', pct: 55 };
  if (year < 2038) return { label: 'U자 동측 연계 형성 중', pct: 80 };
  return { label: 'U자 골격 완성(→2040년대 전구간)', pct: 95 };
}
