import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { REGIONS, GROUND } from '../regions.js';
import Buildings from './Buildings.jsx';
import KenneyModel from './KenneyModel.jsx';
import Korea from './Korea.jsx';
import World from './World.jsx';
import DayNight from './DayNight.jsx';
import Rain from './Rain.jsx';
import PlantsLayer from './PlantsLayer.jsx';
import SubstationsLayer from './SubstationsLayer.jsx';
import Transmission from './Transmission.jsx';
import Highways from './Highways.jsx';
import DemandLayer from './DemandLayer.jsx';
import { TREES, pickModel } from './models.js';

function RegionPads({ onSelect }) {
  return (
    <group>
      {REGIONS.map((r) => (
        <group key={r.id} position={[r.x, 0, r.z]}>
          <Html position={[0, 3.2, 0]} center distanceFactor={26} zIndexRange={[10, 0]}>
            <div className="font-round" onClick={() => onSelect && onSelect(r.id)} style={{
              padding: '3px 12px', borderRadius: 999, whiteSpace: 'nowrap', cursor: 'pointer',
              background: 'rgba(255,255,255,0.9)', color: '#334155',
              border: `2px solid ${r.tint}`, fontWeight: 700, fontSize: 13,
              boxShadow: '0 6px 14px rgba(120,150,190,0.25)', pointerEvents: 'auto',
            }}>{r.name}</div>
          </Html>
        </group>
      ))}
    </group>
  );
}

function Link({ a, b }) {
  const dx = b.x - a.x, dz = b.z - a.z;
  const len = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dz, dx);
  return (
    <mesh position={[(a.x + b.x) / 2, 0.18, (a.z + b.z) / 2]} rotation={[0, -angle, 0]}>
      <boxGeometry args={[len, 0.06, 0.16]} />
      <meshStandardMaterial color="#94a3b8" transparent opacity={0.55} />
    </mesh>
  );
}

function GridLines() {
  const hub = REGIONS.find((r) => r.id === 'chungbuk');   // 중부 허브
  const jeonnam = REGIONS.find((r) => r.id === 'jeonnam');
  const jeju = REGIONS.find((r) => r.id === 'jeju');
  const links = [];
  REGIONS.forEach((r) => {
    if (r.id !== 'chungbuk' && r.id !== 'jeju') links.push([hub, r]);
  });
  if (jeonnam && jeju) links.push([jeonnam, jeju]); // 전남-제주 해저연계
  const valid = links.filter(([a, b]) => a && b);
  return (
    <group>
      {valid.map(([a, b], i) => <Link key={i} a={a} b={b} />)}
    </group>
  );
}
function Decor() {
  // 권역 가장자리에 장식용 나무 (결정적 배치)
  const trees = useMemo(() => {
    const out = [];
    REGIONS.forEach((r, ri) => {
      for (let i = 0; i < 1; i++) {
        const a = (i / 3) * Math.PI * 2 + ri;
        const rad = r.r + 1.2;
        out.push({ id: `t${ri}-${i}`, x: r.x + Math.cos(a) * rad, z: r.z + Math.sin(a) * rad });
      }
    });
    return out;
  }, []);
  return (
    <group>
      {trees.map((t) => (
        <group key={t.id} position={[t.x, 0, t.z]} scale={0.8}>
          <KenneyModel name={pickModel(TREES, t.id)} targetH={0.8} />
        </group>
      ))}
    </group>
  );
}

export default function Scene({ objects, plants = [], subs = [], sun, windFactor, hour = 12, weather = 'clear', year = 2025, onSelectRegion }) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [28, 24, 34], fov: 44 }}
      onCreated={({ scene }) => {
        scene.background = new THREE.Color('#eaf6ff');
        scene.fog = new THREE.Fog('#eaf6ff', 130, 700);
      }}
    >
      <DayNight hour={hour} />

      <Suspense fallback={null}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.28, 0]} receiveShadow>
          <circleGeometry args={[300, 96]} />
          <meshStandardMaterial color="#bfe3f5" />
        </mesh>
        <World />
        <Korea />
        <Highways />
        <RegionPads onSelect={onSelectRegion} />
        <Decor />
        <Buildings objects={objects} sun={sun} windFactor={windFactor} />
        <PlantsLayer plants={plants} />
        <SubstationsLayer subs={subs} />
        <DemandLayer year={year} />
        <Transmission year={year} />
        <Rain active={weather === 'rain'} />
        <ContactShadows position={[0, 0.04, 0]} opacity={0.28} scale={GROUND * 1.6} blur={2.2} far={20} />
      </Suspense>

      <OrbitControls
        enableDamping dampingFactor={0.08}
        minDistance={14} maxDistance={460}
        maxPolarAngle={Math.PI / 2.25} minPolarAngle={0.35}
        target={[0, 1, 2]}
      />
    </Canvas>
  );
}
