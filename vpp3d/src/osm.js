// OSM(OpenStreetMap) 전력설비 1회 로더 — 첫 실행만 Overpass에서 받아 localStorage에 캐시.
// 이후 로드는 캐시 사용(네트워크 X). 실패 시 내장 폴백.
import { FALLBACK_PLANTS, PROVINCES } from './geo.js';

const CACHE_KEY = 'vpp_osm_grid_v1';
const BBOX = '33.0,125.0,38.7,129.9'; // 남한
const ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];

function q(power, withTags) {
  return `[out:json][timeout:60];(nwr["power"="${power}"](${BBOX}););out center ${withTags ? 'tags' : ''};`;
}

async function overpass(query) {
  for (const url of ENDPOINTS) {
    try {
      const res = await fetch(url, { method: 'POST', body: 'data=' + encodeURIComponent(query) });
      if (!res.ok) continue;
      const json = await res.json();
      return json.elements || [];
    } catch (e) { /* 다음 엔드포인트 */ }
  }
  throw new Error('overpass unavailable');
}

function coord(el) {
  if (el.lat != null) return { lat: el.lat, lon: el.lon };
  if (el.center) return { lat: el.center.lat, lon: el.center.lon };
  return null;
}

function plantSource(tags = {}) {
  const s = (tags['plant:source'] || tags['generator:source'] || tags['plant:method'] || '').toLowerCase();
  if (s.includes('nuclear')) return 'nuclear';
  if (s.includes('coal')) return 'coal';
  if (s.includes('gas') || s.includes('lng')) return 'gas';
  if (s.includes('solar') || s.includes('photovoltaic')) return 'solar';
  if (s.includes('wind')) return 'wind';
  if (s.includes('hydro') || s.includes('water')) return 'hydro';
  return 'other';
}

export function fallbackGrid() {
  // 변전소 폴백: 시도 중심 주변에 대표 배치
  const subs = [];
  PROVINCES.forEach((p) => {
    const n = p.id === 'sudogwon' ? 10 : p.id === 'jeju' ? 2 : 5;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      subs.push({ lat: p.lat + Math.cos(a) * 0.25, lon: p.lon + Math.sin(a) * 0.3 });
    }
  });
  return { plants: FALLBACK_PLANTS.map((p) => ({ lat: p.lat, lon: p.lon, source: p.source })), subs, fromCache: false, real: false };
}

export async function loadGrid() {
  // 캐시 우선
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) { const d = JSON.parse(raw); if (d && d.plants && d.subs) return { ...d, fromCache: true }; }
  } catch (e) { /* ignore */ }

  try {
    const [plantEls, subEls] = await Promise.all([overpass(q('plant', true)), overpass(q('substation', false))]);
    const plants = plantEls.map((el) => { const c = coord(el); return c && { ...c, source: plantSource(el.tags) }; }).filter(Boolean);
    const subs = subEls.map(coord).filter(Boolean).slice(0, 1600);
    if (!plants.length && !subs.length) throw new Error('empty');
    const data = { plants: plants.length ? plants : fallbackGrid().plants, subs, real: true };
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch (e) { /* quota */ }
    return { ...data, fromCache: false };
  } catch (e) {
    return fallbackGrid();
  }
}

export function clearGridCache() { try { localStorage.removeItem(CACHE_KEY); } catch (e) {} }
