import { useState, useMemo } from 'react';

// 문제 풀 (제11차 전력수급기본계획·송변전설비계획 등 공식 근거) — 매 세션 랜덤 출제
const POOL = [
  { q: '제11차 전력수급기본계획상 2038년 원전 발전비중은?', o: ['25.6%', '30.6%', '35.6%', '40.6%'], a: 2, src: '제11차 전력수급기본계획(2025.2)' },
  { q: '2038년 신재생에너지 설비용량 목표는?', o: ['약 80GW', '약 100GW', '약 121.9GW', '약 150GW'], a: 2, src: '제11차 전력수급기본계획' },
  { q: '2038년 태양광 설비용량 목표는?', o: ['약 50GW', '약 77.2GW', '약 100GW', '약 120GW'], a: 1, src: '제11차 전력수급기본계획' },
  { q: '2038년 풍력 설비용량 목표는?', o: ['약 20GW', '약 30GW', '약 40.7GW', '약 60GW'], a: 2, src: '제11차 전력수급기본계획' },
  { q: '2038년 무탄소에너지(CFE) 비중 목표는?', o: ['약 50%', '약 60%', '약 70%', '약 85%'], a: 2, src: '제11차 전력수급기본계획' },
  { q: '2038년 최대 전력수요 전망은?', o: ['약 110GW', '약 120GW', '약 128.9GW', '약 140GW'], a: 2, src: '제11차 전력수급기본계획' },
  { q: '2038년까지 변전소는 약 몇 개로? (현재 935개)', o: ['약 1,050개', '약 1,300개', '약 1,600개', '약 2,000개'], a: 1, src: '제11차 장기 송변전설비계획(한전)' },
  { q: '제11차 장기 송변전설비계획 총 투자비는?', o: ['약 30조원', '약 56조원', '약 72.8조원', '약 100조원'], a: 2, src: '한전(2025)' },
  { q: '노후 석탄발전은 몇 년까지 단계적으로 폐지(LNG 전환)?', o: ['2030년', '2033년', '2036년', '2040년'], a: 2, src: '제11차 전력수급기본계획' },
  { q: '호남의 재생에너지를 수도권으로 보내는 전송 방식은?', o: ['765kV 교류', 'HVDC(초고압직류)', '345kV 교류', '배전 직접연결'], a: 1, src: '제11차 장기 송변전설비계획' },
  { q: '세계 최대 규모로 추진되는 전남 신안 해상풍력 용량은?', o: ['2.8GW', '5.5GW', '8.2GW', '12GW'], a: 2, src: '전라남도' },
  { q: '용인 반도체 클러스터에 필요한 전력 규모는?', o: ['약 5GW', '약 10GW', '약 15GW', '약 20GW'], a: 2, src: '용인시·한전(11차 전기본)' },
  { q: '국가첨단전략산업 특화단지(2023)는 몇 곳 지정됐나?', o: ['3곳', '5곳', '7곳', '10곳'], a: 2, src: '산업통상자원부(2023)' },
  { q: '국내 데이터센터의 전력수요는 약 몇 %가 수도권에 집중?', o: ['약 40%', '약 55%', '약 70%', '약 90%'], a: 2, src: '산업부·한전' },
  { q: 'U자형 한반도 에너지고속도로 전구간 완성 목표 시기는?', o: ['2030년대 초', '2030년대 말', '2040년대', '2050년대'], a: 2, src: '정부 에너지고속도로 계획' },
  { q: '분산에너지 활성화 특별법 시행 연도는?', o: ['2022년', '2024년', '2026년', '2028년'], a: 1, src: '산업통상자원부' },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export function QuizModal({ onClose, onShare }) {
  const N = 8;
  const [seed, setSeed] = useState(0);
  const qs = useMemo(() => shuffle(POOL).slice(0, N), [seed]); // eslint-disable-line
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // idx -> selected
  const [finished, setFinished] = useState(false);
  const score = qs.reduce((acc, q, i) => acc + (answers[i] === q.a ? 1 : 0), 0);
  const q = qs[idx];
  const answered = answers[idx] != null;

  const restart = () => { setSeed((s) => s + 1); setIdx(0); setAnswers({}); setFinished(false); };

  const optStyle = (oi) => {
    let bg = 'rgba(255,255,255,0.75)', col = '#475569', bd = '1px solid rgba(148,163,184,0.3)';
    if (answered) {
      if (oi === q.a) { bg = 'linear-gradient(135deg,#6ee7b7,#34d399)'; col = '#065f46'; bd = 'none'; }
      else if (answers[idx] === oi) { bg = 'linear-gradient(135deg,#fda4af,#fb7185)'; col = '#fff'; bd = 'none'; }
    }
    return { background: bg, color: col, border: bd, borderRadius: 12, padding: '9px 12px', fontSize: 13.5, cursor: answered ? 'default' : 'pointer', textAlign: 'left', width: '100%' };
  };

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(30,41,59,0.32)', backdropFilter: 'blur(4px)' }}>
      <div onClick={(e) => e.stopPropagation()} className="pop" style={{ width: '100%', maxWidth: 460, borderRadius: 22, padding: 20, background: 'rgba(255,255,255,0.86)', border: '1px solid rgba(255,255,255,0.9)', boxShadow: '0 24px 60px rgba(120,150,190,0.3)', backdropFilter: 'blur(16px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 className="font-round" style={{ fontSize: 18, color: '#0ea5e9' }}>🎯 전력계통 예측 퀴즈</h2>
          <button onClick={onClose} style={{ border: 'none', background: 'rgba(255,255,255,0.7)', borderRadius: 999, width: 28, height: 28, cursor: 'pointer', color: '#64748b', fontSize: 15 }}>✕</button>
        </div>

        {!finished ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8', margin: '8px 0 4px' }}>
              <span>{idx + 1} / {N}</span><span>점수 {score}</span>
            </div>
            <div style={{ height: 6, borderRadius: 99, background: '#e2e8f0', overflow: 'hidden', marginBottom: 12 }}>
              <div style={{ height: '100%', width: `${((idx + 1) / N) * 100}%`, background: 'linear-gradient(90deg,#7dd3fc,#34d399)' }} />
            </div>

            <div key={idx} className="pop">
              <div className="font-round" style={{ fontSize: 15, color: '#334155', marginBottom: 12, lineHeight: 1.4 }}>Q{idx + 1}. {q.q}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {q.o.map((o, oi) => (
                  <button key={oi} className="font-round" disabled={answered} onClick={() => setAnswers((s) => ({ ...s, [idx]: oi }))} style={optStyle(oi)}>{o}</button>
                ))}
              </div>
              {answered && (
                <div style={{ marginTop: 10, fontSize: 12, color: answers[idx] === q.a ? '#059669' : '#e11d48', fontWeight: 700 }}>
                  {answers[idx] === q.a ? '✅ 정답!' : '❌ 오답'} <span style={{ color: '#94a3b8', fontWeight: 400 }}>📑 {q.src}</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, gap: 8 }}>
              <button className="font-round" disabled={idx === 0} onClick={() => setIdx((i) => i - 1)} style={{ border: '1px solid rgba(148,163,184,0.3)', background: 'rgba(255,255,255,0.7)', color: idx === 0 ? '#cbd5e1' : '#64748b', borderRadius: 14, padding: '9px 16px', fontSize: 13, cursor: idx === 0 ? 'default' : 'pointer' }}>◀ 이전</button>
              {idx < N - 1 ? (
                <button className="font-round" disabled={!answered} onClick={() => setIdx((i) => i + 1)} style={{ border: 'none', borderRadius: 14, padding: '9px 18px', fontSize: 13, color: '#fff', background: answered ? 'linear-gradient(135deg,#7dd3fc,#0ea5e9)' : '#cbd5e1', cursor: answered ? 'pointer' : 'not-allowed' }}>다음 ▶</button>
              ) : (
                <button className="font-round" disabled={!answered} onClick={() => setFinished(true)} style={{ border: 'none', borderRadius: 14, padding: '9px 18px', fontSize: 13, color: '#065f46', background: answered ? 'linear-gradient(135deg,#6ee7b7,#34d399)' : '#cbd5e1', cursor: answered ? 'pointer' : 'not-allowed' }}>결과 보기 🏁</button>
              )}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div className="font-round" style={{ fontSize: 30, color: '#0ea5e9', margin: '10px 0' }}>{score} / {N} 정답!</div>
            <div style={{ fontSize: 14, color: '#5b6b7d', marginBottom: 16 }}>
              {score === N ? '🏆 전력계통 박사!' : score >= N * 0.7 ? '👍 훌륭해요!' : score >= N * 0.4 ? '💪 좋아요, 한 번 더!' : '📚 다시 도전!'}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="font-round" onClick={restart} style={{ flex: 1, border: '1px solid rgba(148,163,184,0.3)', background: 'rgba(255,255,255,0.7)', color: '#64748b', borderRadius: 14, padding: '10px', fontSize: 13, cursor: 'pointer' }}>🔀 새 문제</button>
              <button className="font-round" onClick={() => onShare && onShare(score, N)} style={{ flex: 1, border: 'none', background: 'linear-gradient(135deg,#6ee7b7,#34d399)', color: '#065f46', borderRadius: 14, padding: '10px', fontSize: 13, cursor: 'pointer' }}>🔗 결과 공유</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
