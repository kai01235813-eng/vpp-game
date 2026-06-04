import { useState } from 'react';

const QUIZ = [
  { q: '제11차 전력수급기본계획상 2038년 원전 발전비중은?', options: ['25.6%', '30.6%', '35.6%', '40.6%'], answer: 2, src: '제11차 전력수급기본계획(2025.2)' },
  { q: '2038년 신재생에너지 설비용량 목표는?', options: ['약 80GW', '약 100GW', '약 121.9GW', '약 150GW'], answer: 2, src: '제11차 전력수급기본계획' },
  { q: '2038년까지 변전소는 약 몇 개로? (현재 935개)', options: ['약 1,050개', '약 1,300개', '약 1,600개', '약 2,000개'], answer: 1, src: '제11차 장기 송변전설비계획(한전)' },
  { q: '세계 최대 규모로 추진되는 전남 신안 해상풍력 용량은?', options: ['2.8GW', '5.5GW', '8.2GW', '12GW'], answer: 2, src: '전라남도' },
  { q: '용인 반도체 클러스터에 필요한 전력 규모는?', options: ['약 5GW', '약 10GW', '약 15GW', '약 20GW'], answer: 2, src: '용인시·한전(11차 전기본)' },
];

export function QuizModal({ onClose, onShare }) {
  const [sel, setSel] = useState({});
  const [graded, setGraded] = useState(false);
  const score = QUIZ.reduce((a, q, i) => a + (sel[i] === q.answer ? 1 : 0), 0);
  const allAnswered = QUIZ.every((_, i) => sel[i] != null);

  const optStyle = (qi, oi) => {
    const q = QUIZ[qi];
    let bg = 'rgba(255,255,255,0.7)', col = '#475569', bd = '1px solid rgba(148,163,184,0.3)';
    if (!graded) { if (sel[qi] === oi) { bg = 'linear-gradient(135deg,#7dd3fc,#38bdf8)'; col = '#fff'; bd = 'none'; } }
    else {
      if (oi === q.answer) { bg = 'linear-gradient(135deg,#6ee7b7,#34d399)'; col = '#065f46'; bd = 'none'; }
      else if (sel[qi] === oi) { bg = 'linear-gradient(135deg,#fda4af,#fb7185)'; col = '#fff'; bd = 'none'; }
    }
    return { background: bg, color: col, border: bd, borderRadius: 12, padding: '6px 10px', fontSize: 12.5, cursor: graded ? 'default' : 'pointer', textAlign: 'left', flex: 1 };
  };

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(30,41,59,0.42)', backdropFilter: 'blur(5px)' }}>
      <div onClick={(e) => e.stopPropagation()} className="pop glass" style={{ width: '100%', maxWidth: 480, maxHeight: '86vh', overflowY: 'auto', borderRadius: 22, padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <h2 className="font-round" style={{ fontSize: 19, color: '#0ea5e9' }}>🎯 전력계통 예측 퀴즈</h2>
          <button onClick={onClose} style={{ border: 'none', background: 'rgba(255,255,255,0.7)', borderRadius: 999, width: 28, height: 28, cursor: 'pointer', color: '#64748b', fontSize: 15 }}>✕</button>
        </div>
        <div style={{ fontSize: 11.5, color: '#94a3b8', marginBottom: 10 }}>제11차 전력수급기본계획 기반 — 5문항</div>

        {QUIZ.map((q, qi) => (
          <div key={qi} style={{ marginBottom: 14 }}>
            <div className="font-round" style={{ fontSize: 13.5, color: '#334155', marginBottom: 6 }}>Q{qi + 1}. {q.q}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {q.options.map((o, oi) => (
                <button key={oi} className="font-round" disabled={graded} onClick={() => setSel((s) => ({ ...s, [qi]: oi }))} style={{ ...optStyle(qi, oi), minWidth: '45%' }}>{o}</button>
              ))}
            </div>
            {graded && <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>📑 {q.src}</div>}
          </div>
        ))}

        {!graded ? (
          <button className="font-round" disabled={!allAnswered} onClick={() => setGraded(true)} style={{ width: '100%', border: 'none', borderRadius: 14, padding: '10px', fontSize: 14, color: '#fff', background: allAnswered ? 'linear-gradient(135deg,#7dd3fc,#0ea5e9)' : '#cbd5e1', cursor: allAnswered ? 'pointer' : 'not-allowed' }}>
            채점하기 {allAnswered ? '' : `(${Object.keys(sel).length}/${QUIZ.length})`}
          </button>
        ) : (
          <div>
            <div className="font-round" style={{ textAlign: 'center', fontSize: 22, color: '#0ea5e9', margin: '6px 0' }}>
              {score} / {QUIZ.length} 정답! {score === QUIZ.length ? '🏆' : score >= 3 ? '👍' : '💪'}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="font-round" onClick={() => { setSel({}); setGraded(false); }} style={{ flex: 1, border: '1px solid rgba(148,163,184,0.3)', background: 'rgba(255,255,255,0.7)', color: '#64748b', borderRadius: 14, padding: '9px', fontSize: 13, cursor: 'pointer' }}>다시 풀기</button>
              <button className="font-round" onClick={() => onShare && onShare(score, QUIZ.length)} style={{ flex: 1, border: 'none', background: 'linear-gradient(135deg,#6ee7b7,#34d399)', color: '#065f46', borderRadius: 14, padding: '9px', fontSize: 13, cursor: 'pointer' }}>🔗 결과 공유</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
