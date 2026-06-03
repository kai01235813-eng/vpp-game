import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

const lerpColor = (a, b, t) => new THREE.Color(a).lerp(new THREE.Color(b), t);

// hour(0~24) 기반 하늘/조명. 낮=밝은 하늘, 노을=주황, 밤=네이비
export default function DayNight({ hour = 12 }) {
  const { scene } = useThree();
  const elev = Math.sin(((hour - 6) / 12) * Math.PI); // 6~18 양수(낮)
  const day = Math.max(0, elev);
  const isDawnDusk = hour > 5 && hour < 8 || hour > 16 && hour < 19;

  // 하늘색
  let sky;
  if (elev <= 0) sky = lerpColor('#1e293b', '#3b4a6b', Math.max(0, 0.5 + elev)); // 밤
  else if (isDawnDusk) sky = lerpColor('#fbd5b5', '#eaf6ff', day);               // 노을→낮
  else sky = '#eaf6ff';

  const skyCol = new THREE.Color(sky);
  useEffect(() => {
    scene.background = skyCol;
    if (!scene.fog) scene.fog = new THREE.Fog(skyCol, 130, 700);
    else scene.fog.color = skyCol;
  });

  const sunColor = elev > 0.35 ? '#fff7e6' : '#ffd1a4';
  const sunInt = 0.15 + day * 1.15;
  const ang = ((hour - 6) / 12) * Math.PI; // 0~PI (해 동→서)
  const sunPos = [Math.cos(ang) * 30, Math.max(2, elev * 34), 14];

  return (
    <group>
      <hemisphereLight args={['#ffffff', '#cfe8d6', 0.35 + day * 0.55]} />
      <ambientLight intensity={0.18 + day * 0.18} />
      <directionalLight
        position={sunPos} intensity={sunInt} color={sunColor} castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-34} shadow-camera-right={34}
        shadow-camera-top={34} shadow-camera-bottom={-34} shadow-camera-far={90}
      />
      {/* 달빛 (밤) */}
      {elev <= 0 && <pointLight position={[-18, 22, -10]} intensity={0.4} color="#9db4e0" />}
    </group>
  );
}
