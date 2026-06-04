import { PLAN, START_YEAR, END_YEAR } from '../buildout.js';
import { useIsMobile, MobilePanel } from '../useUI.jsx';

const KEY_YEARS = [
  { year: 2025, label: '현재' },
  { year: 2030, label: '서해안 고속도로' },
  { year: 2031, label: 'HVDC 1차' },
  { year: 2032, label: '용인 반도체' },
  { year: 2036, label: '석탄폐지' },
  { year: 2038, label: '무탄소·U자' },
];

function GrowBar({ label, cur, base, end, unit, color, int }) {
  const fmt = (v) => (int ? Math.round(v).toLocaleString() : (v < 100 ? v.toFixed(1) : v.toFixed(0)));
  const fill = Math.max(0, Math.min(100, (cur / end) * 100));
  const basePos = Math.max(0, Math.min(100, (base / end) * 100));
  return (
    <div style={{ marginBottom: 9 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
        <span style={{ color: '#64748b' }}>{label}</span>
        <span><b style={{ color, fontSize: 12.5 }}>{fmt(cur)}{unit}</b> <span style={{ color: '#cbd5e1' }}>&rarr; {fmt(end)}{unit}</span></span>
      </div>
      <div style={{ position: 'relative', height: 9, borderRadius: 99, background: '#eef2f7', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: fill + '%', background: color, borderRadius: 99, transition: 'width .25s' }} />
        <div style={{ position: 'absolute', top: -1, bottom: -1, left: basePos + '%', width: 2, background: 'rgba(71,85,105,0.55)' }} />
      </div>
    </div>
  );
}

function StatsCard({ stats, year }) {
  return (
    <div className="glass rounded-2xl p-3">
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
        <span className="font-round" style={{ fontSize: 13, color: '#0ea5e9' }}>📊 전력계통 전망</span>
        <span className="font-round" style={{ fontSize: 26, color: '#334155' }}>{Math.floor(year)}<span style={{ fontSize: 13 }}>년</span></span>
      </div>
      <GrowBar label="신재생 설비" cur={stats.renewGW} base={39} end={121.9} unit="GW" color="#34d399" />
      <GrowBar label="태양광" cur={stats.solarGW} base={28} end={77.2} unit="GW" color="#fbbf24" />
      <GrowBar label="풍력" cur={stats.windGW} base={5.5} end={40.7} unit="GW" color="#38bdf8" />
      <GrowBar label="최대 전력수요" cur={stats.demandGW} base={102} end={128.9} unit="GW" color="#fb7185" />
      <GrowBar label="변전소" cur={stats.substations} base={935} end={1297} unit="개" color="#f59e0b" int />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginTop: 2 }}>
        <span style={{ color: '#64748b' }}>원전 비중 <b style={{ color: '#2dd4bf' }}>{stats.nuclearShare.toFixed(1)}%</b></span>
        <span style={{ color: '#64748b' }}>무탄소 <b style={{ color: '#0ea5e9' }}>{stats.cfeShare.toFixed(0)}%</b></span>
      </div>
      <div style={{ fontSize: 9.5, color: '#94a3b8', marginTop: 8, lineHeight: 1.4 }}>
        ▎= 2025 현재 · 막대 끝 = 2038 목표 · {PLAN.sub}<br />※ {PLAN.note}
      </div>
    </div>
  );
}

export default function Hud({ ui, banner, stats, year, playing, onYear, onTogglePlay, onHelp, onCapture, onShare }) {
  const mobile = useIsMobile();
  return (
    <>
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 glass rounded-3xl flex items-center"
        style={{ gap: mobile ? 8 : 16, padding: mobile ? '6px 12px' : '8px 20px', whiteSpace: 'nowrap', maxWidth: '96vw' }}>
        <div className="font-round" style={{ fontSize: mobile ? 12 : 15, color: '#334155', whiteSpace: 'nowrap' }}>⚡ 대한민국 전력계통</div>
        {!mobile && (
          <div style={{ fontSize: 11, color: '#64748b', borderLeft: '1px solid rgba(148,163,184,0.4)', paddingLeft: 12, lineHeight: 1.2 }}>
            <b style={{ color: '#0ea5e9' }}>제11차 전력수급기본계획</b> 기반 실제 데이터 시뮬레이션
          </div>
        )}
        {mobile && <span className="font-round" style={{ fontSize: 14, color: '#0ea5e9' }}>{Math.floor(year)}</span>}
        <button onClick={onHelp} title="읽는 법" style={{ border: 'none', cursor: 'pointer', borderRadius: 999, width: 26, height: 26, background: 'rgba(56,189,248,0.15)', color: '#0ea5e9', fontWeight: 700, fontSize: 14 }}>?</button>
      </div>

      {banner && (
        <div className="pop absolute left-1/2 -translate-x-1/2 z-20 rounded-full px-5 py-2 font-round"
          style={{ top: mobile ? 96 : 80, background: 'rgba(255,255,255,0.96)', border: '2px solid #fbbf24', color: '#b45309', boxShadow: '0 12px 26px rgba(251,191,36,0.28)', maxWidth: '88vw', textAlign: 'center', fontSize: mobile ? 12 : 14 }}>
          {banner}
        </div>
      )}

      {mobile ? (
        <MobilePanel chip="📊 전망" side="left"><StatsCard stats={stats} year={year} /></MobilePanel>
      ) : (
        <div className="absolute top-3 left-3 z-20 w-[330px] flex flex-col gap-3 max-h-[calc(100vh-120px)] overflow-y-auto">
          <div style={{ height: 52 }} />
          <StatsCard stats={stats} year={year} />
        </div>
      )}

      <div className="glass" style={{ position: 'absolute', bottom: mobile ? 8 : 14, left: '50%', transform: 'translateX(-50%)', zIndex: 20, borderRadius: 18, padding: mobile ? '8px 12px' : '10px 18px', width: mobile ? '94vw' : 'min(580px, 92vw)' }}>
        {/* 챕터 북마크 */}
        <div style={{ display: 'flex', gap: 5, overflowX: 'auto', marginBottom: 8, paddingBottom: 2 }}>
          {KEY_YEARS.map((k) => {
            const active = Math.floor(year) >= k.year && (KEY_YEARS.filter((x) => x.year > k.year).every((x) => Math.floor(year) < x.year));
            return (
              <button key={k.year} onClick={() => onYear(k.year)} className="font-round" style={{ flexShrink: 0, border: 'none', cursor: 'pointer', borderRadius: 999, padding: mobile ? '3px 8px' : '3px 10px', fontSize: mobile ? 10 : 11, whiteSpace: 'nowrap', color: active ? '#fff' : '#64748b', background: active ? 'linear-gradient(135deg,#7dd3fc,#0ea5e9)' : 'rgba(255,255,255,0.7)', border: active ? 'none' : '1px solid rgba(148,163,184,0.3)' }}>
                {k.year} {k.label}
              </button>
            );
          })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: mobile ? 8 : 12 }}>
          <button onClick={onTogglePlay} className="font-round" style={{ border: 'none', cursor: 'pointer', borderRadius: 14, padding: mobile ? '7px 10px' : '8px 14px', fontSize: mobile ? 12 : 14, color: '#fff', background: playing ? 'linear-gradient(135deg,#fda4af,#fb7185)' : 'linear-gradient(135deg,#6ee7b7,#34d399)', boxShadow: '0 6px 14px rgba(120,150,190,0.25)', whiteSpace: 'nowrap' }}>
            {playing ? '⏸' : '▶'}{!mobile && (playing ? ' 일시정지' : ' 재생')}
          </button>
          <div style={{ flex: 1 }}>
            <input type="range" min={START_YEAR} max={END_YEAR} step={0.1} value={year}
              onChange={(e) => onYear(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#38bdf8' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#94a3b8', fontFamily: 'Fredoka' }}>
              <span>{START_YEAR}</span><span>2031</span><span>2036</span><span>{END_YEAR}</span>
            </div>
          </div>
          <div className="font-round" style={{ fontSize: mobile ? 18 : 22, color: '#0ea5e9', minWidth: mobile ? 42 : 56, textAlign: 'right' }}>{Math.floor(year)}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6, gap: 8 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={onCapture} className="font-round" style={{ border: '1px solid rgba(148,163,184,0.3)', background: 'rgba(255,255,255,0.7)', color: '#64748b', borderRadius: 10, padding: '3px 9px', fontSize: 11, cursor: 'pointer' }}>📷 캡처</button>
            <button onClick={onShare} className="font-round" style={{ border: '1px solid rgba(148,163,184,0.3)', background: 'rgba(255,255,255,0.7)', color: '#64748b', borderRadius: 10, padding: '3px 9px', fontSize: 11, cursor: 'pointer' }}>🔗 공유</button>
          </div>
          {!mobile && (
            <div style={{ fontSize: 9.5, color: '#94a3b8', textAlign: 'right' }}>
              제11차 전력수급기본계획(2025.2) 기반 · 2025→2038
            </div>
          )}
        </div>
      </div>
    </>
  );
}
