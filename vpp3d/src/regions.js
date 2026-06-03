// 9개 시도 — geo.js 실제 중심좌표 기반
import { PROVINCES, toWorld } from './geo.js';

export const GROUND = 40; // ContactShadows 등 참고용

const R = { sudogwon: 2.6, gangwon: 2.8, chungbuk: 2.2, chungnam: 2.3, jeonbuk: 2.3, jeonnam: 2.7, gyeongbuk: 2.9, gyeongnam: 2.4, busanulsan: 2.2, jeju: 1.6 };

export const REGIONS = PROVINCES.map((p) => {
  const [x, z] = toWorld(p.lat, p.lon);
  return { ...p, x, z, r: R[p.id] || 2.4 };
});
export const regionById = (id) => REGIONS.find((r) => r.id === id);

// 수요측 설비(아파트/공장/데이터센터) 빌드아웃 가중치 — 발전/변전소는 OSM 실데이터 사용
export const REGION_WEIGHTS = {
  sudogwon:  { apt: 22, factory: 3,  datacenter: 6 },
  gangwon:   { apt: 4,  factory: 2 },
  chungbuk:  { apt: 8,  factory: 7 },
  chungnam:  { apt: 7,  factory: 12, datacenter: 2 },
  jeonbuk:   { apt: 5,  factory: 6 },
  jeonnam:   { apt: 4,  factory: 8 },
  gyeongbuk: { apt: 6,  factory: 14 },
  gyeongnam: { apt: 6,  factory: 13 },
  busanulsan:{ apt: 12, factory: 14, datacenter: 1 },
  jeju:      { apt: 3 },
};

export const TYPE_INFO = {
  solar:      { icon: '☀️', name: '태양광', color: '#fbbf24' },
  wind:       { icon: '🌀', name: '풍력',   color: '#38bdf8' },
  apt:        { icon: '🏢', name: '아파트', color: '#fb7185' },
  factory:    { icon: '🏭', name: '공장',   color: '#fb923c' },
  nuclear:    { icon: '⚛️', name: '원전',   color: '#2dd4bf' },
  datacenter: { icon: '🖥️', name: '데이터센터', color: '#818cf8' },
  coal:       { icon: '⚫', name: '석탄',   color: '#6b7280' },
  gas:        { icon: '🔥', name: 'LNG',    color: '#fb923c' },
  hydro:      { icon: '💧', name: '수력',   color: '#22d3ee' },
  substation: { icon: '🔌', name: '변전소', color: '#f59e0b' },
};
