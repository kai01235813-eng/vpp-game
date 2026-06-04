import { useState, useMemo } from 'react';

// 30문항 풀 — 제11차 전력수급기본계획/장기 송변전설비계획·국가 정책 기반. 매 세션 랜덤 출제
const POOL = [
  { q: '제11차 전력수급기본계획상 2038년 원전 발전비중은?', o: ['25.6%', '30.6%', '35.6%', '40.6%'], a: 2, exp: '11차 전기본은 원전을 최대 발전원으로 두어 2038년 35.6% 비중을 목표로 합니다(신규 대형원전·SMR 포함).', src: '제11차 전력수급기본계획(2025.2)' },
  { q: '2038년 신재생에너지 설비용량 목표는?', o: ['약 80GW', '약 100GW', '약 121.9GW', '약 150GW'], a: 2, exp: '2025년 약 39GW에서 2038년 121.9GW로 약 3배 확대됩니다(태양광·풍력 중심).', src: '제11차 전력수급기본계획' },
  { q: '2038년 태양광 설비용량 목표는?', o: ['약 50GW', '약 77.2GW', '약 100GW', '약 120GW'], a: 1, exp: '신재생 121.9GW 중 태양광이 77.2GW로 가장 큰 비중을 차지합니다.', src: '제11차 전력수급기본계획' },
  { q: '2038년 풍력 설비용량 목표는?', o: ['약 20GW', '약 30GW', '약 40.7GW', '약 60GW'], a: 2, exp: '풍력은 40.7GW 목표로, 신안·울산 등 대규모 해상풍력이 견인합니다.', src: '제11차 전력수급기본계획' },
  { q: '2038년 무탄소에너지(CFE) 비중 목표는?', o: ['약 50%', '약 60%', '약 70%', '약 85%'], a: 2, exp: '원전+신재생+수소 등 무탄소에너지 비중이 약 70.7%에 이를 전망입니다.', src: '제11차 전력수급기본계획' },
  { q: '2038년 최대 전력수요 전망은?', o: ['약 110GW', '약 120GW', '약 128.9GW', '약 140GW'], a: 2, exp: '반도체·데이터센터·전기화로 수요가 급증해 2038년 128.9GW로 전망됩니다.', src: '제11차 전력수급기본계획' },
  { q: '2030년 발전비중에서 LNG는 약 몇 %?', o: ['약 17%', '약 25%', '약 32%', '약 40%'], a: 1, exp: '2030년 발전비중은 원전 31.8%·LNG 25.1%·석탄 17.4%·신재생 21.6% 수준입니다.', src: '제11차 전력수급기본계획' },
  { q: '2030년 원전 발전비중은 약 몇 %?', o: ['약 26%', '약 31.8%', '약 36%', '약 42%'], a: 1, exp: '원전 비중은 2030년 31.8% → 2038년 35.6%로 점진 확대됩니다.', src: '제11차 전력수급기본계획' },
  { q: '2038년까지 변전소는 약 몇 개로? (현재 935개)', o: ['약 1,050개', '약 1,300개', '약 1,600개', '약 2,000개'], a: 1, exp: '신규 전력망 확충으로 변전소가 935개에서 약 1,297개로 늘어날 전망입니다.', src: '제11차 장기 송변전설비계획(한전)' },
  { q: '제11차 장기 송변전설비계획 총 투자비는?', o: ['약 30조원', '약 56조원', '약 72.8조원', '약 100조원'], a: 2, exp: '2024~2038년 72.8조원 투자로, 10차 계획(56.5조원)보다 16.3조원 증가했습니다.', src: '한전(2025)' },
  { q: '노후 석탄발전은 몇 년까지 단계적 폐지(LNG 전환)?', o: ['2030년', '2033년', '2036년', '2040년'], a: 2, exp: '노후 석탄발전을 2036년까지 단계적으로 폐지하고 LNG로 전환합니다.', src: '제11차 전력수급기본계획' },
  { q: '호남의 재생에너지를 수도권으로 보내는 핵심 전송 방식은?', o: ['765kV 교류', 'HVDC(초고압직류)', '345kV 교류', '배전 직접연결'], a: 1, exp: '장거리·대용량 전송에 유리한 HVDC(해저 직결 포함)로 호남 재생E를 수도권에 보냅니다.', src: '제11차 장기 송변전설비계획' },
  { q: '세계 최대 규모로 추진되는 전남 신안 해상풍력 용량은?', o: ['2.8GW', '5.5GW', '8.2GW', '12GW'], a: 2, exp: '신안 해상풍력은 8.2GW(약 48조원) 규모로 2035년 완성을 목표로 합니다.', src: '전라남도' },
  { q: '용인 반도체 클러스터에 필요한 전력 규모는?', o: ['약 5GW', '약 10GW', '약 15GW', '약 20GW'], a: 2, exp: '국가산단 9GW+일반산단 6GW로 약 15GW, 2024년 최대수요의 약 16.5%에 해당합니다.', src: '용인시·한전(11차 전기본)' },
  { q: '국가첨단전략산업 특화단지(2023)는 몇 곳 지정됐나?', o: ['3곳', '5곳', '7곳', '10곳'], a: 2, exp: '반도체·이차전지·디스플레이 분야 7곳이 지정됐고 총 투자 약 614조원 규모입니다.', src: '산업통상자원부(2023)' },
  { q: '국내 데이터센터 전력수요는 약 몇 %가 수도권에 집중?', o: ['약 40%', '약 55%', '약 70%', '약 90%'], a: 2, exp: 'AI 데이터센터의 약 70%가 수도권에 몰려 송전망 부담이 커, 분산정책을 추진 중입니다.', src: '산업부·한전' },
  { q: 'U자형 한반도 에너지고속도로 전구간 완성 목표 시기는?', o: ['2030년대 초', '2030년대 말', '2040년대', '2050년대'], a: 2, exp: '서해안은 2030년대, U자형(서·남·동해안) 전구간은 2040년대 완성을 목표로 합니다.', src: '정부 에너지고속도로 계획' },
  { q: '분산에너지 활성화 특별법 시행 연도는?', o: ['2022년', '2024년', '2026년', '2028년'], a: 1, exp: '2024년 6월 시행. 수요지 인근 발전·분산 배치를 촉진합니다.', src: '산업통상자원부' },
  { q: '우리나라 전력계통의 정격 주파수는?', o: ['50Hz', '60Hz', '110Hz', '220Hz'], a: 1, exp: '한국 계통은 60Hz가 정격이며, 수급 균형이 깨지면 주파수가 흔들립니다.', src: '전력계통 운영 기준' },
  { q: '신재생의 출력 변동성을 보완하는 대표 수단이 아닌 것은?', o: ['ESS(에너지저장)', '출력제어', '양수발전', '석탄 상시가동'], a: 3, exp: 'ESS·출력제어·양수발전 등으로 변동성을 보완하며, 석탄 상시가동은 탈탄소 방향과 배치됩니다.', src: '제11차 전력수급기본계획' },
  { q: '국내 최대 원전 밀집지(고리·새울)는 어느 권역?', o: ['전남', '경북', '부산·울산', '강원'], a: 2, exp: '고리(부산 기장)·새울(울산 울주)이 모여 국내 최대 원전 밀집지를 이룹니다.', src: '한국수력원자력' },
  { q: '한빛 원전이 위치한 지역은?', o: ['전남 영광', '경북 울진', '경북 경주', '부산 기장'], a: 0, exp: '한빛 원전은 전남 영광에 위치합니다(서해안).', src: '한국수력원자력' },
  { q: '한울 원전이 위치한 지역은?', o: ['전남 영광', '경북 울진', '충남 보령', '강원 삼척'], a: 1, exp: '한울 원전은 경북 울진(동해안)에 위치합니다.', src: '한국수력원자력' },
  { q: '새만금이 특화하는 미래 에너지 분야는?', o: ['원자력', '그린수소·태양광', 'LNG', '양수발전'], a: 1, exp: '전북 새만금은 100MW급 수전해 그린수소와 대규모 태양광을 추진합니다.', src: '전북도·산업부' },
  { q: '강원(동해·삼척) 수소특화단지의 핵심 기능은?', o: ['수소 생산만', '액화수소 저장·운송', '수소차 정비', '해외 수입'], a: 1, exp: '2024년 지정된 강원 특화단지는 액화수소 저장·운송에 특화합니다.', src: '산업부 수소특화단지' },
  { q: '제5차 국토종합계획이 제시한 새로운 국가 성장축은?', o: ['경부 종축', 'U자형 연안축', '내륙 순환축', '수도권 집중축'], a: 1, exp: '경부축 중심에서 벗어나 서·남·동해안을 잇는 U자형 연안 성장축을 지향합니다.', src: '제5차 국토종합계획(2020~2040)' },
  { q: '제2차 국가도로망종합계획에서 강조된 축은?', o: ['환황해·환동해축', '경부·호남축', '내륙고속화축', '수도권 외곽순환'], a: 0, exp: '격자망을 개편해 서해(환황해)·동해(환동해)·남해안을 잇는 벨트를 강화합니다.', src: '제2차 국가도로망종합계획(2021~2030)' },
  { q: '울산이 추진하는 대표 신재생 사업은?', o: ['내륙 태양광', '부유식 해상풍력', '조력발전', '바이오매스'], a: 1, exp: '울산은 동해 수심을 활용한 부유식 해상풍력 6GW(추진 9GW)를 추진합니다.', src: '산업부·울산시' },
  { q: '경북 포항 수소특화단지의 핵심은?', o: ['발전용 연료전지', '수소차 충전', '암모니아 수입', '수전해 전용'], a: 0, exp: '포항은 발전용 연료전지 중심의 수소특화단지로 지정됐습니다(2024).', src: '산업부' },
  { q: '서해안 에너지고속도로의 주된 목적은?', o: ['관광 활성화', '서해안 재생E를 수도권으로 전송', '석탄 수송', '해수담수화'], a: 1, exp: 'HVDC·BESS로 서해안 재생에너지를 수도권·산업 수요지로 보내는 송전 인프라입니다.', src: '한전 에너지고속도로' },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export function QuizModal({ onClose, onShare }) {
  const N = 10;
  const [seed, setSeed] = useState(0);
  const qs = useMemo(() => shuffle(POOL).slice(0, N), [seed]); // eslint-disable-line
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const score = qs.reduce((acc, q, i) => acc + (answers[i] === q.a ? 1 : 0), 0);
  const q = qs[idx];
  const answered = answers[idx] != null;
  const correct = answers[idx] === q.a;

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
      <div onClick={(e) => e.stopPropagation()} className="pop" style={{ width: '100%', maxWidth: 460, maxHeight: '88vh', overflowY: 'auto', borderRadius: 22, padding: 20, background: 'rgba(255,255,255,0.88)', border: '1px solid rgba(255,255,255,0.9)', boxShadow: '0 24px 60px rgba(120,150,190,0.3)', backdropFilter: 'blur(16px)' }}>
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
                <div style={{ marginTop: 12, padding: 12, borderRadius: 14, background: correct ? 'rgba(52,211,153,0.12)' : 'rgba(251,113,133,0.12)', border: `1px solid ${correct ? 'rgba(52,211,153,0.4)' : 'rgba(251,113,133,0.4)'}` }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: correct ? '#059669' : '#e11d48' }}>
                    {correct ? '✅ 정답!' : `❌ 오답 — 정답: ${q.o[q.a]}`}
                  </div>
                  <div style={{ fontSize: 12, color: '#475569', marginTop: 6, lineHeight: 1.55 }}>{q.exp}</div>
                  <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 6 }}>📑 출처: {q.src}</div>
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
