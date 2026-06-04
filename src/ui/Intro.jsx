import { useState } from 'react';
import { GuideContent } from './Guide.jsx';

const SLIDES = [
  { h: '제11차 전력수급기본계획 시뮬레이터', icon: '🇰🇷 ⚡ 2025 → 2038',
    body: '이 시뮬레이션은 산업통상자원부가 2025년 2월 확정한 \u201c제11차 전력수급기본계획\u201d과 한전 \u201c제11차 장기 송변전설비계획\u201d의 실제 수치를 기반으로 합니다. 2025년 현재 전력망에서 출발해 2038년까지 설비가 어떻게 늘어나는지 보여줍니다.' },
  { h: '무엇을 보게 되나요?', icon: '☀️ 🌀 ⚛️ 🔌',
    body: '신재생 39→121.9GW(태양광 77.2·풍력 40.7), 원전 비중 35.6%, 최대수요 128.9GW, 변전소 약 +320개. 호남 태양광·해상풍력, 수도권 용인 반도체 클러스터, 호남–수도권 HVDC, 석탄 폐지 등 핵심 계획이 연도별로 펼쳐집니다.' },
  { h: 'U자형 연안축으로 잇는 대한민국', icon: '🇰🇷 U',
    body: '경부축(서울–부산) 중심에서 벗어나 서·남·동해안을 잇는 U자형 연안축이 국가 골격이 되고 있습니다. 제5차 국토종합계획(2020~2040)의 연안 성장축, 제2차 국가도로망종합계획(2021~2030)의 환황해·환동해축, 그리고 U자형 한반도 에너지고속도로(HVDC, 2030~2040년대)가 한 방향을 가리킵니다 — 해안의 재생에너지를 수도권·산업으로.' },
  { h: '조작 방법', icon: '🎬',
    body: '하단 타임라인이 자동 재생되며 2025→2038로 진행됩니다. 슬라이더를 드래그하면 원하는 연도로 이동, 지역 이름표를 클릭하면 그 시도의 발전소·변전소·미래정책 브리핑을 볼 수 있어요.' },
  { h: '이 시뮬레이션 읽는 법', icon: '🗺️', guide: true },
];

export default function Intro({ onStart }) {
  const [i, setI] = useState(0);
  const last = i === SLIDES.length - 1;
  const s = SLIDES[i];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(180,210,235,0.45)', backdropFilter: 'blur(14px)' }}>
      <div className="pop w-full max-w-2xl rounded-[28px] p-7"
        style={{ background: 'rgba(255,255,255,0.94)', border: '1px solid rgba(255,255,255,0.9)', boxShadow: '0 24px 60px rgba(120,150,190,0.3)' }}>
        <h2 className="font-round text-2xl mb-1" style={{ color: '#0ea5e9' }}>{s.h}</h2>
        <div className="h-1 w-full rounded-full mb-5" style={{ background: 'linear-gradient(90deg,#7dd3fc,#6ee7b7,#fbbf24)' }} />
        <div className="text-center text-5xl mb-5">{s.icon}</div>
        <div className="rounded-2xl p-5 text-[15px] leading-relaxed"
          style={{ background: 'linear-gradient(135deg,#f0f8ff,#f3fbf2)', border: '1px solid rgba(56,189,248,0.15)', color: '#5b6b7d', maxHeight: s.guide ? '52vh' : 'none', overflowY: s.guide ? 'auto' : 'visible' }}>
          {s.guide ? <GuideContent /> : s.body}
        </div>
        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-1.5">
            {SLIDES.map((_, k) => (
              <span key={k} className="h-2 w-2 rounded-full" style={{ background: k === i ? '#38bdf8' : '#cbd5e1' }} />
            ))}
          </div>
          <div className="flex gap-2">
            {i > 0 && (
              <button onClick={() => setI(i - 1)} className="font-round px-5 py-2.5 rounded-2xl text-white"
                style={{ background: 'linear-gradient(135deg,#cbd5e1,#94a3b8)' }}>◀ 이전</button>
            )}
            {!last ? (
              <button onClick={() => setI(i + 1)} className="font-round px-5 py-2.5 rounded-2xl text-white"
                style={{ background: 'linear-gradient(135deg,#7dd3fc,#60a5fa)', boxShadow: '0 8px 18px rgba(96,165,250,0.35)' }}>다음 ▶</button>
            ) : (
              <button onClick={onStart} className="font-round px-6 py-2.5 rounded-2xl"
                style={{ background: 'linear-gradient(135deg,#6ee7b7,#34d399)', color: '#065f46', boxShadow: '0 8px 18px rgba(52,211,153,0.4)' }}>시뮬레이션 시작 🚀</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
