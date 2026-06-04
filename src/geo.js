// 실제 위경도 → 3D 월드 투영 (등거리, 위도보정). 남한 외곽선/시도 중심/주요 발전소.
export const LAT0 = 36.2, LON0 = 127.8, K = 7.4;
const cos0 = Math.cos((LAT0 * Math.PI) / 180);

// (lat,lon) → [x, z]  (북쪽 lat↑ → -z)
export function toWorld(lat, lon) {
  return [(lon - LON0) * K * cos0, -(lat - LAT0) * K];
}

// 남한 본토 외곽선 (위경도, 시계방향) — 실제 해안선 근사
export const SK_OUTLINE = [
  [37.92, 126.68], [37.72, 126.5], [37.45, 126.6], [37.25, 126.6], [37.0, 126.5],
  [36.95, 126.35], [36.78, 126.13], [36.62, 126.3], [36.5, 126.33], [36.3, 126.5],
  [36.0, 126.5], [35.97, 126.64], [35.72, 126.46], [35.55, 126.6], [35.42, 126.45],
  [35.28, 126.42], [35.05, 126.38], [34.79, 126.39], [34.5, 126.5], [34.3, 126.52],
  [34.35, 126.75], [34.45, 127.05], [34.55, 127.28], [34.42, 127.3], [34.6, 127.5],
  [34.74, 127.66], [34.85, 127.9], [34.7, 127.92], [34.83, 128.2], [34.84, 128.42],
  [34.7, 128.6], [35.0, 128.78], [35.08, 128.85], [35.1, 129.05], [35.32, 129.29],
  [35.5, 129.4], [35.78, 129.5], [36.05, 129.57], [36.3, 129.43], [36.5, 129.43],
  [37.0, 129.42], [37.45, 129.17], [37.8, 128.95], [38.05, 128.65], [38.45, 128.46],
  [38.3, 128.0], [38.25, 127.5], [38.15, 127.0], [38.0, 126.75],
];
// 제주도
export const JEJU = { lat: 33.38, lon: 126.55, rx: 0.55, rz: 0.32 };

// 9개 시도 실제 중심좌표 (대표)
export const PROVINCES = [
  { id: 'sudogwon',  name: '수도권', lat: 37.45, lon: 127.0, tint: '#fb7185' },
  { id: 'gangwon',   name: '강원',   lat: 37.72, lon: 128.3, tint: '#60a5fa' },
  { id: 'chungbuk',  name: '충북',   lat: 36.8,  lon: 127.7, tint: '#fbbf24' },
  { id: 'chungnam',  name: '충남',   lat: 36.5,  lon: 126.9, tint: '#fdba74' },
  { id: 'jeonbuk',   name: '전북',   lat: 35.72, lon: 127.1, tint: '#a3e635' },
  { id: 'jeonnam',   name: '전남',   lat: 34.9,  lon: 126.9, tint: '#34d399' },
  { id: 'gyeongbuk', name: '경북',   lat: 36.3,  lon: 128.7, tint: '#38bdf8' },
  { id: 'gyeongnam', name: '경남',   lat: 35.25, lon: 128.2, tint: '#c4b5fd' },
  { id: 'busanulsan', name: '부산·울산', lat: 35.4, lon: 129.18, tint: '#f0abfc' },
  { id: 'jeju',      name: '제주',   lat: 33.4,  lon: 126.55, tint: '#f9a8d4' },
];

// 주요 발전소 폴백 데이터 (OSM 로드 실패 시) — 실제 위치·종류 근사
export const FALLBACK_PLANTS = [
  { name: '고리·새울 원전', lat: 35.32, lon: 129.29, source: 'nuclear', region: 'busanulsan' },
  { name: '한빛 원전(영광)', lat: 35.41, lon: 126.42, source: 'nuclear', region: 'jeonnam' },
  { name: '한울 원전(울진)', lat: 37.09, lon: 129.38, source: 'nuclear', region: 'gyeongbuk' },
  { name: '월성 원전(경주)', lat: 35.71, lon: 129.47, source: 'nuclear', region: 'gyeongbuk' },
  { name: '당진화력', lat: 37.06, lon: 126.50, source: 'coal', region: 'chungnam' },
  { name: '태안화력', lat: 36.90, lon: 126.24, source: 'coal', region: 'chungnam' },
  { name: '보령화력', lat: 36.40, lon: 126.49, source: 'coal', region: 'chungnam' },
  { name: '하동화력', lat: 35.07, lon: 127.78, source: 'coal', region: 'gyeongnam' },
  { name: '삼천포화력', lat: 34.95, lon: 128.06, source: 'coal', region: 'gyeongnam' },
  { name: '영흥화력', lat: 37.24, lon: 126.43, source: 'coal', region: 'sudogwon' },
  { name: '신인천 복합(LNG)', lat: 37.48, lon: 126.60, source: 'gas', region: 'sudogwon' },
  { name: '평택 복합(LNG)', lat: 36.99, lon: 126.83, source: 'gas', region: 'sudogwon' },
  { name: '광양 복합(LNG)', lat: 34.93, lon: 127.70, source: 'gas', region: 'jeonnam' },
  { name: '새만금 태양광', lat: 35.79, lon: 126.62, source: 'solar', region: 'jeonbuk' },
  { name: '영암 태양광', lat: 34.74, lon: 126.45, source: 'solar', region: 'jeonnam' },
  { name: '신안 해상풍력', lat: 34.83, lon: 126.10, source: 'wind', region: 'jeonnam' },
  { name: '서남해 해상풍력', lat: 35.55, lon: 126.30, source: 'wind', region: 'jeonbuk' },
  { name: '울산 부유식 해상풍력', lat: 35.45, lon: 129.55, source: 'wind', region: 'busanulsan' },
  { name: '제주 행원·한경 풍력', lat: 33.47, lon: 126.30, source: 'wind', region: 'jeju' },
  { name: '대관령 풍력', lat: 37.68, lon: 128.74, source: 'wind', region: 'gangwon' },
  { name: '청송 양수', lat: 36.43, lon: 129.10, source: 'hydro', region: 'gyeongbuk' },
  { name: '충주 수력', lat: 37.0, lon: 127.93, source: 'hydro', region: 'chungbuk' },
];

export const PLANT_STYLE = {
  nuclear: { color: '#2dd4bf', icon: '⚛️', name: '원전' },
  coal:    { color: '#6b7280', icon: '🏭', name: '석탄' },
  gas:     { color: '#fb923c', icon: '🔥', name: 'LNG' },
  solar:   { color: '#fbbf24', icon: '☀️', name: '태양광' },
  wind:    { color: '#38bdf8', icon: '🌀', name: '풍력' },
  hydro:   { color: '#22d3ee', icon: '💧', name: '수력' },
  other:   { color: '#a78bfa', icon: '⚡', name: '발전' },
};

// 권역별 주요 변전소(대표 명칭) — 클릭 시 표시용
export const MAJOR_SUBS = {
  sudogwon:  ['동서울S/S', '신가평S/S', '신김포S/S', '신파주S/S', '신안성S/S'],
  gangwon:   ['신태백S/S', '신영동S/S', '신강원S/S'],
  chungbuk:  ['신청주S/S', '신충주S/S', '신제천S/S'],
  chungnam:  ['북당진S/S', '신서산S/S', '신온양S/S', '신탕정S/S'],
  jeonbuk:   ['신전주S/S', '신군산S/S', '새만금S/S'],
  jeonnam:   ['신강진S/S', '나주S/S', '신영광S/S', '신광주S/S'],
  gyeongbuk: ['신영주S/S', '신경산S/S', '신포항S/S', '신울진S/S'],
  gyeongnam: ['신김해S/S', '신마산S/S', '진주S/S', '신고성S/S'],
  busanulsan: ['신양산S/S', '신울산S/S', '신온산S/S', '북부산S/S'],
  jeju:      ['한라S/S', '신제주S/S'],
};

// 위경도 → 가장 가까운 시도 id
export function provinceOf(lat, lon) {
  let best = PROVINCES[0], bd = Infinity;
  for (const p of PROVINCES) { const d = (p.lat - lat) ** 2 + (p.lon - lon) ** 2; if (d < bd) { bd = d; best = p; } }
  return best.id;
}

// 주요 송전 backbone (크게크게) — 765kV AC / HVDC. path=[[lat,lon],...]
export const TRANSMISSION = [
  // 내륙 765kV AC backbone (기존, 2025~)
  { name: '동해안–수도권 765kV', type: 'ac', from: 2025, path: [[37.1, 129.4], [37.3, 128.4], [37.55, 127.5]] },
  { name: '영남 원전계통 765kV', type: 'ac', from: 2025, path: [[35.32, 129.29], [35.3, 128.2], [36.3, 128.6]] },
  // U자형 한반도 에너지고속도로 (HVDC) — 연도별 단계 준공 (정부계획: 서해안 2030년대 → U자 2040년대)
  { name: '서해안 에너지고속도로(HVDC)', type: 'hvdc', from: 2030, path: [[37.35, 126.35], [36.8, 126.3], [36.0, 126.4], [35.4, 126.3], [34.7, 126.2]] },
  { name: '호남–수도권 HVDC(해저직결)', type: 'hvdc', from: 2031, path: [[34.9, 126.8], [35.6, 126.6], [36.6, 126.7], [37.5, 127.1]] },
  { name: 'U자 동측 연계(남해안–동해안)', type: 'hvdc', from: 2037, path: [[34.7, 126.2], [34.8, 127.6], [35.2, 128.7], [35.5, 129.35], [36.4, 129.45], [37.1, 129.4]] },
];

// 권역별 미래 에너지정책 브리핑 (출처: 산업부·지자체·한전, 2024~2025)
export const REGION_POLICY = {
  sudogwon: { headline: '반도체 클러스터 · 전력수요 집중', tags: ['반도체', '데이터센터', '수요집중'],
    detail: ['용인 첨단시스템반도체 클러스터 15GW (국가산단 9 + 일반산단 6) — 2024 최대수요(97GW)의 약 16.5%', '전국 전력수요 집중 → 송변전망 확충·분산에너지가 핵심 과제'], src: '용인시·한전' },
  gangwon: { headline: '동해안 발전벨트 · 액화수소 저장', tags: ['수소저장', '동해안송전', '풍력'],
    detail: ['동해·삼척 액화수소 저장·운송 수소특화단지 (2024 첫 지정, 5년 3,177억원)', '동해안 발전전력을 수도권으로 보내는 765kV 송전선로 거점'], src: '산업부 수소특화단지' },
  chungbuk: { headline: '내륙 반도체 · 수자원', tags: ['반도체', '수력'],
    detail: ['청주 SK하이닉스 반도체 생산거점', '충주댐 수력·남한강 수자원 풍부'], src: '용인시청·업계' },
  chungnam: { headline: '서해안 발전전환 · 분산에너지', tags: ['석탄→LNG', '분산에너지', '태양광'],
    detail: ['당진·태안·보령 석탄화력 → 2036년까지 LNG 전환(11차 전기본)', '서산 분산에너지 특화지역(수요유치형) 후보 (2025)'], src: '산업부 분산에너지' },
  jeonbuk: { headline: '새만금 그린수소 · 태양광', tags: ['그린수소', '태양광'],
    detail: ['새만금 100MW급 수전해 그린수소 클러스터', '완주 수소특화 국가산업단지 추진'], src: '전북도·산업부' },
  jeonnam: { headline: '신재생 메카 · 세계 최대 해상풍력', tags: ['해상풍력', '신재생', '원전', '분산에너지'],
    detail: ['신안 8.2GW 해상풍력 (2035, 48조원, 세계 최대) + 부유식 10GW 추진', '해남 분산에너지 특화지역(수요유치) 후보 · 한빛 원전(영광)'], src: '전남도·산업부' },
  gyeongbuk: { headline: '원전 · 수소연료전지 · 반도체', tags: ['원전', '수소연료전지', '반도체'],
    detail: ['울진 한울 원전 + 신규 대형원전 입지', '포항 발전용 연료전지 수소특화단지(2024) · 분산에너지 특화 후보 · 구미 반도체'], src: '산업부' },
  gyeongnam: { headline: '기계·중공업 · 남해안 발전벨트', tags: ['중공업', '석탄→LNG'],
    detail: ['창원 기계·방산 산업단지 (대규모 산업부하)', '하동·삼천포 석탄화력 → LNG 전환(11차 전기본)'], src: '산업부·창원시' },
  busanulsan: { headline: '원전 밀집 · 부유식 해상풍력 · 수소', tags: ['원전', '부유식풍력', '수소', '분산에너지'],
    detail: ['고리·새울 원전 — 국내 최대 원전 밀집지(부산 기장·울산 울주)', '울산 부유식 해상풍력 6GW(추진 9GW) · 울산 수소모빌리티', '부산·울산 분산에너지 특화지역 후보(2025)'], src: '산업부·울산시' },
  jeju: { headline: '재생에너지 선도 · 분산에너지 특구', tags: ['풍력', '분산에너지', '출력제어'],
    detail: ['풍력·태양광 보급 전국 선도 (잉여전력 출력제어 이슈)', '제주 분산에너지 특화지역(신사업형) 후보 · CFI 2030 탄소없는 섬'], src: '제주도·산업부' },
};

// 주요 고속도로 (환황해=서해안, 환동해=동해안, 남해안, 경부) — 국토 U자 연안축
export const HIGHWAYS = [
  { name: '경부고속도로', path: [[37.46, 127.03], [37.27, 127.0], [36.81, 127.15], [36.35, 127.42], [36.12, 128.1], [35.87, 128.6], [35.5, 129.05], [35.17, 129.08]] },
  { name: '서해안고속도로', path: [[37.45, 126.9], [37.3, 126.83], [36.9, 126.63], [36.08, 126.7], [35.6, 126.7], [34.99, 126.43], [34.81, 126.42]] },
  { name: '남해고속도로', path: [[34.81, 126.42], [34.95, 127.49], [35.19, 128.08], [35.23, 128.68], [35.18, 128.98]] },
  { name: '동해고속도로', path: [[35.2, 129.1], [35.55, 129.32], [36.02, 129.36], [36.41, 129.37], [37.0, 129.3], [37.45, 129.17], [37.75, 128.9], [38.2, 128.59]] },
  { name: '영동고속도로', path: [[37.45, 126.7], [37.3, 127.63], [37.34, 127.92], [37.6, 128.4], [37.75, 128.9]] },
  { name: '중앙고속도로', path: [[35.87, 128.6], [36.57, 128.73], [37.13, 128.19], [37.34, 127.92], [37.88, 127.73]] },
  { name: '호남고속도로', path: [[36.35, 127.42], [35.82, 127.15], [35.16, 126.85], [34.95, 127.49]] },
  { name: '중부고속도로', path: [[37.46, 127.13], [37.27, 127.44], [36.64, 127.49], [36.35, 127.42]] },
  { name: '통영대전고속도로', path: [[36.35, 127.42], [35.9, 127.6], [35.52, 127.73], [35.19, 128.08], [34.85, 128.43]] },
  { name: '중부내륙고속도로', path: [[37.0, 127.93], [36.6, 128.05], [36.42, 128.16], [35.9, 128.2], [35.5, 128.4], [35.23, 128.68]] },
  { name: '평택제천고속도로', path: [[36.99, 126.83], [36.99, 127.35], [37.0, 127.93], [37.13, 128.19]] },
  { name: '서울양양고속도로', path: [[37.55, 127.1], [37.72, 127.45], [37.88, 127.73], [38.0, 128.17], [38.07, 128.62]] },
  { name: '광주대구고속도로', path: [[35.16, 126.85], [35.4, 127.4], [35.52, 127.73], [35.7, 128.2], [35.87, 128.6]] },
  { name: '당진영덕고속도로', path: [[36.9, 126.6], [36.65, 127.2], [36.5, 128.2], [36.41, 129.37]] },
  { name: '익산포항고속도로', path: [[35.94, 126.96], [35.82, 127.6], [35.9, 128.2], [36.02, 129.36]] },
];

// 정책 기반 대규모 전력수요 거점 (국가첨단전략산업 특화단지 2023·11차 전기본·데이터센터 정책)
// size = 글로우 반경 가중(상대), info = 규모, policy = 근거, from = 본격화 연도
export const DEMAND_HUBS = [
  { name: '용인 반도체 클러스터', lat: 37.18, lon: 127.21, type: 'semi', region: 'sudogwon', size: 3.0, info: '15GW · 562조원', from: 2030, policy: '국가첨단전략산업 특화단지(반도체) · 제11차 전력수급기본계획', src: '산업부·한전' },
  { name: '평택 반도체', lat: 37.21, lon: 127.11, type: 'semi', region: 'sudogwon', size: 2.3, info: '삼성 평택캠퍼스', from: 2025, policy: '국가첨단전략산업 특화단지(반도체)', src: '산업부' },
  { name: '구미 반도체 특화단지', lat: 36.12, lon: 128.34, type: 'semi', region: 'gyeongbuk', size: 1.6, info: '4.7조원', from: 2026, policy: '국가첨단전략산업 특화단지(반도체)', src: '산업부' },
  { name: '천안·아산 디스플레이', lat: 36.82, lon: 127.15, type: 'disp', region: 'chungnam', size: 1.8, info: '17.2조원', from: 2025, policy: '국가첨단전략산업 특화단지(디스플레이)', src: '산업부' },
  { name: '청주 이차전지 특화단지', lat: 36.64, lon: 127.49, type: 'batt', region: 'chungbuk', size: 1.6, info: '4.2조원', from: 2025, policy: '국가첨단전략산업 특화단지(이차전지)', src: '산업부' },
  { name: '포항 이차전지 특화단지', lat: 36.02, lon: 129.34, type: 'batt', region: 'gyeongbuk', size: 2.0, info: '12.1조원', from: 2025, policy: '국가첨단전략산업 특화단지(이차전지)', src: '산업부' },
  { name: '새만금 이차전지 특화단지', lat: 35.79, lon: 126.70, type: 'batt', region: 'jeonbuk', size: 1.8, info: '6.4조원', from: 2026, policy: '국가첨단전략산업 특화단지(이차전지)', src: '산업부' },
  { name: '울산 이차전지·석유화학', lat: 35.50, lon: 129.30, type: 'batt', region: 'busanulsan', size: 2.0, info: '7.4조원', from: 2025, policy: '국가첨단전략산업 특화단지(이차전지)', src: '산업부' },
  { name: '수도권 AI 데이터센터 집적', lat: 37.40, lon: 127.05, type: 'dc', region: 'sudogwon', size: 2.6, info: '전국 DC 약 70% 집중', from: 2025, policy: '데이터센터 전력수요 급증 · 분산에너지법', src: '산업부·한전' },
  { name: '비수도권 분산 데이터센터', lat: 36.95, lon: 126.70, type: 'dc', region: 'chungnam', size: 1.4, info: '당진·충주·예천 등', from: 2027, policy: '분산에너지 활성화 특별법(2024)', src: '산업부' },
  { name: '여수 국가산단(석유화학)', lat: 34.86, lon: 127.70, type: 'petro', region: 'jeonnam', size: 1.8, info: '대규모 상시 산업부하', from: 2025, policy: '국가산업단지', src: '-' },
  { name: '광양 제철소', lat: 34.94, lon: 127.70, type: 'steel', region: 'jeonnam', size: 1.6, info: 'POSCO', from: 2025, policy: '국가산업단지', src: '-' },
  { name: '대산 석유화학단지', lat: 37.00, lon: 126.36, type: 'petro', region: 'chungnam', size: 1.5, info: '서산 대산', from: 2025, policy: '국가산업단지', src: '-' },
];

export const DEMAND_STYLE = {
  semi:  { color: '#818cf8', icon: '🔷', name: '반도체' },
  batt:  { color: '#22c55e', icon: '🔋', name: '이차전지' },
  disp:  { color: '#f472b6', icon: '🖼️', name: '디스플레이' },
  dc:    { color: '#38bdf8', icon: '🖥️', name: '데이터센터' },
  petro: { color: '#fb923c', icon: '🛢️', name: '석유화학' },
  steel: { color: '#f87171', icon: '⚙️', name: '제철' },
};
