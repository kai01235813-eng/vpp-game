// VPP 시뮬레이션 — 수급/주파수/ESS + 날씨·돌발이벤트·원전·데이터센터 (제11차 전력수급기본계획 반영)
import { REGIONS, REGION_WEIGHTS, regionById } from './regions.js';

export const TICK_SPEED = 0.3;
export const MAX_LEVEL = 20;
export const TICK_MS = 300;

let _uid = 0;
export const nextId = () => `o${_uid++}`;

function scatter(region) {
  const a = Math.random() * Math.PI * 2;
  const rad = Math.sqrt(Math.random()) * region.r;
  return [region.x + Math.cos(a) * rad, region.z + Math.sin(a) * rad];
}
export function makeObject(type, regionId) {
  const region = regionById(regionId) || REGIONS[0];
  const [x, z] = scatter(region);
  return { id: nextId(), type, region: regionId, pos: [x, z], rot: Math.random() * Math.PI * 2, phase: Math.random() * 10, scale: 0.9 + Math.random() * 0.25, bornAt: performance.now() };
}
export function spawn(state, type, regionId, count = 1) {
  for (let i = 0; i < count; i++) state.objects.push(makeObject(type, regionId));
}

// 날씨
export const WEATHER = {
  clear:  { icon: '☀️', name: '맑음', sun: 1.0,  wind: 1.0 },
  cloudy: { icon: '☁️', name: '흐림', sun: 0.55, wind: 1.0 },
  rain:   { icon: '🌧️', name: '비',  sun: 0.25, wind: 1.15 },
  wind:   { icon: '🌬️', name: '강풍', sun: 0.85, wind: 1.9 },
};
const WEATHER_PICK = ['clear', 'clear', 'clear', 'cloudy', 'cloudy', 'rain', 'wind'];

// 돌발 이벤트
export const EVENTS = [
  { type: 'heat',       label: '🔥 폭염 — 냉방 수요 급증!',        demandMult: 1.45, supplyMult: 1.0,  ticks: 110 },
  { type: 'cold',       label: '❄️ 한파 — 난방 수요 급증!',        demandMult: 1.40, supplyMult: 1.0,  ticks: 110 },
  { type: 'fault',      label: '⚠️ 발전설비 고장 — 공급 감소!',     demandMult: 1.0,  supplyMult: 0.82, ticks: 90  },
];

export function initialState() {
  const s = {
    time: 720, level: 1, freq: 60.0, coins: 0,
    supply: 0, demand: 0, targetSupply: 0, targetDemand: 0,
    essCap: 2000, essLevel: 1000,
    action: 'stop', DROn: false, cutOn: false,
    isAuto: false, mode: 'REAL',
    objects: [],
    weather: 'clear', weatherTimer: 70,
    event: null,
    freqStatus: 'ok',
    hour: 12, sun: 0, windFactor: 0.6,
    counts: { solar: 0, wind: 0, apt: 0, factory: 0, nuclear: 0, datacenter: 0 },
  };
  spawn(s, 'apt', 'sudogwon', 5);
  spawn(s, 'wind', 'jeju', 3);
  spawn(s, 'wind', 'gangwon', 2);
  spawn(s, 'solar', 'jeonnam', 3);
  spawn(s, 'solar', 'jeonbuk', 2);
  spawn(s, 'factory', 'gyeongnam', 2);
  spawn(s, 'factory', 'chungnam', 2);
  spawn(s, 'apt', 'gyeongbuk', 1);
  spawn(s, 'nuclear', 'gyeongbuk', 1);
  spawn(s, 'nuclear', 'gyeongnam', 1);
  return s;
}

export function weightedPick(items, weightFn) {
  const w = items.map(weightFn);
  const total = w.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) { if (r < w[i]) return items[i]; r -= w[i]; }
  return items[items.length - 1];
}

export function autoExpansion(state) {
  if (Math.random() < 0.1) return null;
  const ids = REGIONS.map((r) => r.id);
  const region = weightedPick(ids, (id) => Object.values(REGION_WEIGHTS[id]).reduce((a, b) => a + b, 0));
  const type = weightedPick(Object.keys(REGION_WEIGHTS[region]), (t) => REGION_WEIGHTS[region][t]);
  const amount = type === 'nuclear' ? 1 : Math.floor(Math.random() * 2) + 1;
  spawn(state, type, region, amount);
  return { region, type, amount };
}

// 돌발 이벤트 발생
export function triggerEvent(state) {
  const e = EVENTS[Math.floor(Math.random() * EVENTS.length)];
  state.event = { type: e.type, label: e.label, demandMult: e.demandMult, supplyMult: e.supplyMult, ticksLeft: e.ticks };
  return { label: e.label };
}

function autoControl(s, g, l) {
  if (g > l + 200) { if (s.essLevel < s.essCap) { s.action = 'charge'; s.cutOn = false; } else { s.action = 'stop'; s.cutOn = true; } }
  else if (g < l - 200) { if (s.essLevel > 0) { s.action = 'discharge'; s.DROn = false; } else { s.action = 'stop'; s.DROn = true; } }
  else { s.action = 'stop'; s.cutOn = false; s.DROn = false; }
}

export function step(s) {
  s.time += TICK_SPEED;
  let leveled = false;
  if (s.time >= 1440) { s.time = 0; if (s.level < MAX_LEVEL) { s.level++; leveled = true; } }
  s.hour = s.time / 60;

  // 날씨 전환
  if (--s.weatherTimer <= 0) {
    s.weather = WEATHER_PICK[Math.floor(Math.random() * WEATHER_PICK.length)];
    s.weatherTimer = 50 + Math.floor(Math.random() * 60);
  }
  const wx = WEATHER[s.weather];

  // 이벤트 만료
  if (s.event) { if (--s.event.ticksLeft <= 0) s.event = null; }
  const evDem = s.event ? s.event.demandMult : 1;
  const evSup = s.event ? s.event.supplyMult : 1;

  // 수요측 카운트 (아파트/공장/데이터센터)
  const c = { apt: 0, factory: 0, datacenter: 0 };
  for (const o of s.objects) c[o.type] = (c[o.type] || 0) + 1;
  // 발전소 카운트 (실좌표 OSM/하드코딩)
  const pc = s.plantCounts || { nuclear: 0, coal: 0, gas: 0, solar: 0, wind: 0, hydro: 0 };

  const h = s.hour;
  const curve = (h > 9 && h < 21) ? 1.3 : 0.7;
  let tDem = (2000 + c.apt * 100 + c.factory * 300) * curve + c.datacenter * 550;
  if (s.DROn) tDem *= 0.8;
  tDem *= evDem;

  const sun = ((h > 7 && h < 18) ? Math.sin((h - 7) / 11 * Math.PI) : 0) * wx.sun;
  const wind = (0.5 + Math.sin(s.time * 0.05) * 0.3) * wx.wind;
  let tSup = 1000 + pc.nuclear * 1200 + pc.coal * 520 + pc.gas * 420 + pc.hydro * 160
           + pc.solar * 160 * sun + pc.wind * 200 * wind;
  if (s.cutOn) tSup *= 0.7;
  tSup *= evSup;

  s.essCap = 2000 + s.objects.length * 100;
  if (s.isAuto) autoControl(s, tSup, tDem);
  let flow = 0;
  if (s.action === 'charge') flow = -1500;
  if (s.action === 'discharge') flow = 1500;
  s.essLevel -= flow * 0.03;
  s.essLevel = Math.max(0, Math.min(s.essLevel, s.essCap));
  tSup += flow;

  s.targetDemand = tDem; s.targetSupply = tSup;
  s.demand += (s.targetDemand - s.demand) * 0.1;
  s.supply += (s.targetSupply - s.supply) * 0.1;

  const diff = s.supply - s.demand;
  s.freq += diff * 0.00005;
  s.freq += (60 - s.freq) * 0.03;

  const dev = Math.abs(60 - s.freq);
  s.freqStatus = dev <= 0.2 ? 'ok' : dev <= 0.5 ? 'warn' : 'danger';
  if (s.freqStatus === 'ok') s.coins += 0.12;

  s.sun = Math.max(0, sun);
  s.windFactor = wind;
  s.counts = { ...c, ...pc, substation: s.subCount || 0 };
  return leveled;
}

export function coach(s) {
  if (s.isAuto) return { msg: 'AI 자동 제어 중입니다.', mood: 'happy' };
  if (s.supply > s.demand + 200) return { msg: '과잉 공급! [ESS 충전] 또는 [신재생 출력제어]!', mood: 'worry' };
  if (s.supply < s.demand - 200) return { msg: '전력 부족! [ESS 방전] 또는 [DR(수요감축)]!', mood: 'alert' };
  return { msg: '안정적입니다. 코인 채굴 중!', mood: 'neutral' };
}
