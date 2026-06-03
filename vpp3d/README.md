# KEPCO VPP 3D Grid Sim (프로토타입)

기존 2D 캔버스 VPP 게임을 **React + Vite + three.js(@react-three/fiber)** 로 이식한 3D 프로토타입입니다.
그래픽은 Kenney 에셋(GLB) + 절차적 태양광/풍력 모델, UI는 파스텔 글래스 톤.

## 실행

```bash
npm install
npm run dev      # 개발 서버 (http://localhost:5173)
# 또는
npm run build && npm run preview   # 프로덕션 빌드 미리보기
```

> ⚠️ GLB 모델을 fetch로 불러오므로 `index.html`을 파일로 직접 열면 안 되고,
> 반드시 위 dev/preview 서버(또는 정적 호스팅)로 실행하세요.

## 구조

- `src/sim.js` — 수급/주파수/ESS/자동증설/AI 시뮬레이션 (기존 로직 이식)
- `src/regions.js` — 6개 권역 좌표·가중치·설비 카탈로그
- `src/scene/` — 3D 씬
  - `Scene.jsx` 지형·조명·카메라·권역패드·계통선·장식
  - `Buildings.jsx` 설비 배치(+생성 팝업 애니메이션)
  - `KenneyModel.jsx` GLB 로드 후 bbox 정규화(스케일/바닥정렬)
  - `Solar.jsx` / `Wind.jsx` 절차적 태양광·풍력터빈
- `src/ui/` — `Hud.jsx`(파스텔 HUD), `Intro.jsx`(인트로)
- `public/models/` — Kenney GLB (city/factory/tree)

## 에셋 출처
Kenney (city-kit-industrial, factory-kit, nature-kit) — CC0.
태양광/풍력은 기본 도형 조합으로 직접 제작.
