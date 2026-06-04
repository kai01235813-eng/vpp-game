const dot = (c) => <span style={{ display: 'inline-block', width: 14, height: 14, borderRadius: 4, background: c }} />;
const line = (c) => <span style={{ display: 'inline-block', width: 20, height: 4, borderRadius: 2, background: c, verticalAlign: 'middle' }} />;

function Row({ swatch, title, desc }) {
  return (
    <div style={{ display: 'flex', gap: 9, marginBottom: 9, alignItems: 'flex-start' }}>
      <div style={{ flexShrink: 0, marginTop: 2, minWidth: 34, display: 'flex', gap: 3, alignItems: 'center' }}>{swatch}</div>
      <div><b style={{ color: '#334155', fontSize: 13 }}>{title}</b><div style={{ fontSize: 11.5, color: '#5b6b7d', lineHeight: 1.45 }}>{desc}</div></div>
    </div>
  );
}

export function GuideContent() {
  return (
    <div style={{ textAlign: 'left' }}>
      <Row swatch={<span style={{ fontSize: 16 }}>⚛️</span>}
        title="발전소 (공급)"
        desc="원전·석탄·LNG·태양광·풍력·수력 등 실제 위치에 배치. 마커에 마우스를 올리면(hover) 발전소 이름이 떠요." />
      <Row swatch={<>{dot('#f59e0b')}{dot('#ef4444')}</>}
        title="변전소 (계통)"
        desc="주황 = 기존 변전소(2025년 935개), 빨강 = 신설(2038년까지 +362개, 총 1,297개). 연도가 흐르면 빨간 변전소가 늘어나는 게 보입니다." />
      <Row swatch={<span style={{ display: 'inline-block', width: 26, height: 12, borderRadius: 6, background: 'linear-gradient(90deg,#fde047,#f97316,#b91c1c)' }} />}
        title="전력수요 거점 🔆"
        desc="반투명 글로우의 크기·색(노랑→빨강)이 전력수요 규모. 클수록·빨갈수록 수요가 큰 곳이에요. hover하면 산업(반도체·이차전지·데이터센터 등)·정책·규모가 표시됩니다." />
      <Row swatch={<>{line('#22d3ee')}</>}
        title="송전선"
        desc="청록 = HVDC 에너지고속도로, 보라 = 765kV 교류 송전. 연도가 지날수록 서해안 → U자형으로 형성돼요." />
      <Row swatch={line('#b6a48a')}
        title="고속도로"
        desc="경부·서해안·남해·동해 등 주요 고속도로. 서·남·동해안이 U자형 연안축(국토·도로 계획과 같은 골격)을 이룹니다." />
      <Row swatch={<span style={{ fontSize: 16 }}>🖱️</span>}
        title="지역 클릭"
        desc="지도의 지역 이름표(예: 전남)를 누르면 그 권역의 발전소·주요 변전소·전력수요 거점·미래 에너지정책 브리핑이 떠요. 화면 드래그로 회전, 휠로 줌." />
      <Row swatch={<span style={{ fontSize: 15 }}>📊📋</span>}
        title="좌·우 패널"
        desc="좌측 = 전력계통 전망(현재→2038 성장 막대), 우측 = 국가 정책 안내판(연도별 변화·근거·출처). 모바일은 상단 칩을 눌러 열어요." />
      <Row swatch={<span style={{ fontSize: 16 }}>⏱️</span>}
        title="연도 타임라인"
        desc="하단 ▶로 자동 재생(2025→2038), 슬라이더를 끌면 원하는 연도로 이동해 미래를 비교할 수 있어요." />
      <Row swatch={<span style={{ fontSize: 16 }}>☀️</span>}
        title="날씨·낮밤"
        desc="맑음·흐림·비·강풍과 시간대가 태양광·풍력 발전에 반영됩니다(시각 효과)." />
    </div>
  );
}

export function GuideModal({ onClose }) {
  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(30,41,59,0.4)', backdropFilter: 'blur(6px)' }}>
      <div onClick={(e) => e.stopPropagation()} className="pop glass" style={{ width: '100%', maxWidth: 520, maxHeight: '82vh', overflowY: 'auto', borderRadius: 24, padding: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <h2 className="font-round" style={{ fontSize: 20, color: '#0ea5e9' }}>🗺️ 이 시뮬레이션 읽는 법</h2>
          <button onClick={onClose} style={{ border: 'none', background: 'rgba(255,255,255,0.7)', borderRadius: 999, width: 30, height: 30, cursor: 'pointer', color: '#64748b', fontSize: 16 }}>✕</button>
        </div>
        <div className="h-1 w-full rounded-full mb-4" style={{ background: 'linear-gradient(90deg,#7dd3fc,#6ee7b7,#fbbf24)' }} />
        <GuideContent />
      </div>
    </div>
  );
}
