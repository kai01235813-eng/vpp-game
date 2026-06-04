import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Scene from './scene/Scene.jsx';
import Hud from './ui/Hud.jsx';
import Intro from './ui/Intro.jsx';
import { initialState, step, triggerEvent, coach, TICK_MS } from './sim.js';
import { TYPE_INFO, regionById, REGIONS } from './regions.js';
import { visibleAt, statsAt, MILESTONES, PHASES, phaseAt, uStage, START_YEAR, END_YEAR } from './buildout.js';
import { FALLBACK_PLANTS, PLANT_STYLE, MAJOR_SUBS, provinceOf, REGION_POLICY, DEMAND_HUBS, DEMAND_STYLE } from './geo.js';
import { visibleSubsAt } from './substations.js';
import { useIsMobile, MobilePanel } from './useUI.jsx';

function snapshot(s) {
  return {
    freq: s.freq, coins: s.coins, supply: s.supply, demand: s.demand,
    essCap: s.essCap, essLevel: s.essLevel, action: s.action, DROn: s.DROn,
    cutOn: s.cutOn, isAuto: s.isAuto, sun: s.sun || 0, windFactor: s.windFactor || 0.6,
    hour: s.hour || 12, weather: s.weather || 'clear',
    freqStatus: s.freqStatus || 'ok', event: s.event ? s.event.label : null,
    counts: s.counts || {},
  };
}

const YEAR_STEP = 0.06; // 틱당 진행 (≈65초에 2025→2038)

export default function App() {
  const sim = useRef(initialState());
  const [started, setStarted] = useState(false);
  const [year, setYear] = useState(START_YEAR);
  const [playing, setPlaying] = useState(true);
  const [ui, setUi] = useState(() => snapshot(sim.current));
  const [banner, setBanner] = useState(null);
  const [selRegion, setSelRegion] = useState(null);
  const bannerTimer = useRef(null);
  const yearRef = useRef(year);
  const prevYear = useRef(year);
  yearRef.current = year;

  const yearKey = Math.round(year * 10);
  const visible = useMemo(() => visibleAt(year), [yearKey]); // eslint-disable-line
  const visibleRef = useRef(visible);
  visibleRef.current = visible;
  const visibleSubs = useMemo(() => visibleSubsAt(year), [yearKey]); // eslint-disable-line
  const subsRef = useRef(visibleSubs);
  subsRef.current = visibleSubs;
  const stats = statsAt(year);

  const showBanner = useCallback((msg, ms = 3600) => {
    setBanner(msg);
    clearTimeout(bannerTimer.current);
    bannerTimer.current = setTimeout(() => setBanner(null), ms);
  }, []);

  // 발전소 카운트(공급) — 하드코딩 주요 발전소 기준
  useEffect(() => {
    const pc = { nuclear: 0, coal: 0, gas: 0, solar: 0, wind: 0, hydro: 0 };
    FALLBACK_PLANTS.forEach((p) => { pc[p.source] = (pc[p.source] || 0) + 1; });
    sim.current.plantCounts = pc;
  }, []);


  // 시뮬 틱 (운영: 주파수/수급/ESS) — 현재 연도의 설비로 구동
  useEffect(() => {
    if (!started) return;
    sim.current.isAuto = true; // 관찰형: AI 자동운영
    const id = setInterval(() => {
      sim.current.objects = visibleRef.current;
      sim.current.subCount = subsRef.current.length;
      step(sim.current);
      setUi(snapshot(sim.current));
    }, TICK_MS);
    return () => clearInterval(id);
  }, [started]);

  // 연도 자동 진행
  useEffect(() => {
    if (!started || !playing) return;
    const id = setInterval(() => {
      setYear((y) => Math.min(END_YEAR, +(y + YEAR_STEP).toFixed(3)));
    }, TICK_MS);
    return () => clearInterval(id);
  }, [started, playing]);

  // 마일스톤 감지
  useEffect(() => {
    const py = prevYear.current;
    MILESTONES.forEach((m) => {
      if (py < m.year && year >= m.year) showBanner(`📅 ${m.year}  ${m.text}${m.src ? '  · 출처: ' + m.src : ''}`, 5500);
    });
    if (year >= END_YEAR && py < END_YEAR) setPlaying(false);
    prevYear.current = year;
  }, [year, showBanner]);




  return (
    <div className="fixed inset-0">
      <Scene objects={visible} plants={FALLBACK_PLANTS} subs={visibleSubs} sun={ui.sun} windFactor={ui.windFactor}
        hour={ui.hour} weather={ui.weather} year={year} onSelectRegion={setSelRegion} />
      {started && (
        <Hud ui={ui} banner={banner} stats={stats}
          year={year} playing={playing}
          onYear={(y) => { setYear(y); setPlaying(false); }}
          onTogglePlay={() => setPlaying((p) => !p)} />
      )}
      {started && <NationalPanel year={year} stats={stats} />}
      {started && selRegion && (
        <RegionCard regionId={selRegion} plants={FALLBACK_PLANTS} subs={visibleSubs} onClose={() => setSelRegion(null)} />
      )}
      {!started && <Intro onStart={() => setStarted(true)} />}
    </div>
  );
}

function RegionCard({ regionId, plants, subs, onClose }) {
  const mobile = useIsMobile();
  const region = regionById(regionId);
  const here = plants.filter((p) => p.region === regionId);
  const subCount = subs.filter((s) => s.region === regionId).length;
  const majors = MAJOR_SUBS[regionId] || [];
  return (
    <div className="glass pop" style={mobile
      ? { position: 'fixed', left: 8, right: 8, bottom: 8, zIndex: 31, maxHeight: '60vh', overflowY: 'auto', borderRadius: 18, padding: 14 }
      : { position: 'absolute', left: 10, bottom: 14, zIndex: 31, width: 250, borderRadius: 18, padding: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span className="font-round" style={{ fontSize: 16, color: '#334155', borderBottom: `3px solid ${region.tint}` }}>{region.name}</span>
        <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8', fontSize: 18 }}>✕</button>
      </div>
      <div style={{ fontSize: 11, color: '#0ea5e9', fontWeight: 700, margin: '2px 0 4px' }}>발전소</div>
      {here.length ? here.map((p) => (
        <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, padding: '1px 0' }}>
          <span>{(PLANT_STYLE[p.source] || PLANT_STYLE.other).icon} {p.name}</span>
        </div>
      )) : <div style={{ fontSize: 12, color: '#94a3b8' }}>주요 발전소 없음</div>}
      <div style={{ fontSize: 11, color: '#0ea5e9', fontWeight: 700, margin: '8px 0 4px' }}>주요 변전소 <span style={{ color: '#f59e0b' }}>· 총 {subCount}개소</span></div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {majors.map((m) => (
          <span key={m} style={{ fontSize: 11, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.4)', color: '#b45309', borderRadius: 8, padding: '1px 6px' }}>🔌 {m}</span>
        ))}
      </div>
      {DEMAND_HUBS.filter((h) => h.region === regionId).length > 0 && (
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 11, color: '#0ea5e9', fontWeight: 700, marginBottom: 3 }}>전력수요 거점 (정책 기반)</div>
          {DEMAND_HUBS.filter((h) => h.region === regionId).map((h) => {
            const st = DEMAND_STYLE[h.type];
            return (
              <div key={h.name} style={{ fontSize: 11.5, color: '#5b6b7d', marginBottom: 3 }}>
                <span style={{ display: 'flex', gap: 4 }}><span>{st.icon}</span><span><b style={{ color: '#334155' }}>{h.name}</b> <span style={{ color: st.color }}>{h.info}</span></span></span>
                <span style={{ fontSize: 9.5, color: '#94a3b8' }}>{h.policy} · {h.from}년~</span>
              </div>
            );
          })}
        </div>
      )}
      {REGION_POLICY[regionId] && (
        <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid rgba(148,163,184,0.25)' }}>
          <div style={{ fontSize: 11, color: '#0ea5e9', fontWeight: 700 }}>미래 에너지정책</div>
          <div style={{ fontSize: 12, color: '#334155', fontWeight: 700, margin: '2px 0 4px' }}>{REGION_POLICY[regionId].headline}</div>
          {REGION_POLICY[regionId].detail.map((d, i) => (
            <div key={i} style={{ fontSize: 11.5, color: '#5b6b7d', display: 'flex', gap: 4, marginBottom: 3 }}><span>•</span><span>{d}</span></div>
          ))}
          <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>출처: {REGION_POLICY[regionId].src}</div>
        </div>
      )}
    </div>
  );
}

function Briefing({ region }) {
  const pol = REGION_POLICY[region.id];
  if (!pol) return null;
  return (
    <div className="glass pop" style={{ position: 'absolute', right: 10, bottom: 14, zIndex: 20, width: 290, maxWidth: '46vw', borderRadius: 18, padding: 14 }}>
      <div style={{ fontSize: 10, color: '#94a3b8' }}>지역 브리핑 · 미래 에너지정책</div>
      <div className="font-round" style={{ fontSize: 15, color: '#334155', margin: '2px 0 4px' }}>
        <span style={{ borderBottom: `3px solid ${region.tint}`, paddingBottom: 1 }}>{region.name}</span>
        <span style={{ fontSize: 13, color: '#0ea5e9', marginLeft: 6 }}>{pol.headline}</span>
      </div>
      {pol.detail.map((d, i) => (
        <div key={i} style={{ fontSize: 11.5, color: '#5b6b7d', display: 'flex', gap: 5, marginBottom: 3 }}><span>•</span><span>{d}</span></div>
      ))}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
        {pol.tags.map((t) => (
          <span key={t} style={{ fontSize: 10, background: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.35)', color: '#0ea5e9', borderRadius: 8, padding: '1px 6px' }}>#{t}</span>
        ))}
      </div>
      <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 6 }}>출처: {pol.src}</div>
    </div>
  );
}

function Legend() {
  const items = [
    ['#22d3ee', 'HVDC 에너지고속도로'],
    ['#c084fc', '765kV 교류 송전'],
    ['#b6a48a', '고속도로'],
    ['#f59e0b', '기존 변전소(2025)'],
    ['#ef4444', '신설 변전소(~2038)'],
  ];
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 10px', marginTop: 6 }}>
      {items.map(([c, t]) => (
        <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#64748b' }}>
          <span style={{ width: 14, height: 4, borderRadius: 2, background: c, display: 'inline-block' }} /> {t}
        </span>
      ))}
    </div>
  );
}

function NationalBody({ year, stats }) {
  const ph = phaseAt(year);
  const u = uStage(year);
  const recent = MILESTONES.filter((m) => m.year <= Math.floor(year) && m.year > year - 3).slice(-3);
  return (
    <div className="glass" style={{ borderRadius: 18, padding: 14 }}>
      <div style={{ fontSize: 11, color: '#94a3b8' }}>📋 국가 전력정책 안내판 · {Math.floor(year)}년</div>
      <div className="font-round" style={{ fontSize: 17, color: '#0ea5e9', margin: '2px 0 2px' }}>{ph.name}</div>
      <div style={{ fontSize: 12, color: '#5b6b7d', lineHeight: 1.4 }}>{ph.desc}</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, margin: '10px 0 4px' }}>
        {[['신재생', stats.renewGW.toFixed(0), 'GW', '#34d399'], ['원전비중', stats.nuclearShare.toFixed(1), '%', '#2dd4bf'], ['최대수요', stats.demandGW.toFixed(0), 'GW', '#fb7185'], ['태양광', stats.solarGW.toFixed(0), 'GW', '#fbbf24'], ['풍력', stats.windGW.toFixed(0), 'GW', '#38bdf8'], ['변전소', stats.substations, '', '#f59e0b']].map(([l, v, u2, c]) => (
          <div key={l} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.5)', borderRadius: 10, padding: '4px 0' }}>
            <div style={{ fontSize: 9.5, color: '#94a3b8' }}>{l}</div>
            <div className="font-round" style={{ fontSize: 14, color: c }}>{v}<span style={{ fontSize: 9 }}>{u2}</span></div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>무탄소에너지 {stats.cfeShare.toFixed(0)}%</div>

      <div style={{ marginTop: 10 }}>
        <div style={{ fontSize: 11, color: '#0ea5e9', fontWeight: 700 }}>🛣️ U자형 에너지고속도로 진행</div>
        <div style={{ height: 6, borderRadius: 99, background: '#e2e8f0', overflow: 'hidden', margin: '4px 0' }}>
          <div style={{ height: '100%', width: u.pct + '%', background: 'linear-gradient(90deg,#67e8f9,#22d3ee)' }} />
        </div>
        <div style={{ fontSize: 11, color: '#5b6b7d' }}>{u.label}</div>
      </div>

      {recent.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <div style={{ fontSize: 11, color: '#0ea5e9', fontWeight: 700, marginBottom: 3 }}>최근 주요 변화</div>
          {recent.map((m) => (
            <div key={m.year + m.text} style={{ fontSize: 11.5, color: '#5b6b7d', marginBottom: 4 }}>
              <span style={{ display: 'flex', gap: 5 }}><b style={{ color: '#334155' }}>{m.year}</b><span>{m.text}</span></span>
              {m.src && <span style={{ fontSize: 9.5, color: '#94a3b8' }}>· 출처: {m.src}</span>}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(148,163,184,0.25)' }}>
        <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700 }}>범례</div>
        <Legend />
        <div style={{ fontSize: 9.5, color: '#64748b', marginTop: 6, lineHeight: 1.4 }}>🔆 반투명 글로우 = 정책 기반 <b>전력수요 거점</b>(반도체·이차전지·디스플레이·데이터센터·석유화학·제철). 국가첨단전략산업 특화단지(2023, 614조원)·데이터센터 정책 반영.</div>
        <div style={{ fontSize: 9.5, color: '#94a3b8', marginTop: 6, lineHeight: 1.4 }}>출처: 제11차 전력수급기본계획·송변전설비계획, 제5차 국토종합계획, 제2차 국가도로망종합계획, 산업부 수소특화단지·분산에너지, 한전</div>
      </div>
    </div>
  );
}

function NationalPanel({ year, stats }) {
  const mobile = useIsMobile();
  if (mobile) return <MobilePanel chip="📋 정책" side="right"><NationalBody year={year} stats={stats} /></MobilePanel>;
  return (
    <div style={{ position: 'absolute', right: 10, top: 64, zIndex: 20, width: 300, maxWidth: '46vw', maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
      <NationalBody year={year} stats={stats} />
    </div>
  );
}