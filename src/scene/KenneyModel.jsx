import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { url } from './models.js';

// GLB 로드 → bbox 정규화(목표 높이/바닥 정렬) → 선택적 파스텔 틴트
export default function KenneyModel({ name, targetH = 2, tint = null, ...props }) {
  const { scene } = useGLTF(url(name));
  const obj = useMemo(() => {
    const clone = scene.clone(true);

    // 정규화
    let box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);
    const s = targetH / (size.y || 1);
    clone.scale.setScalar(s);
    box = new THREE.Box3().setFromObject(clone);
    const cx = (box.min.x + box.max.x) / 2;
    const cz = (box.min.z + box.max.z) / 2;
    clone.position.set(-cx, -box.min.y, -cz);

    // 틴트 (원본 명암 유지하며 색 입히기) — 캐시 보호 위해 머티리얼 복제
    const col = tint ? new THREE.Color(tint) : null;
    const tintMat = (m) => {
      const nm = m.clone();
      if (col && nm.color) {
        const o = m.color;
        const lum = 0.3 * o.r + 0.59 * o.g + 0.11 * o.b; // 0..1
        nm.color = col.clone().multiplyScalar(0.55 + 0.6 * lum);
      }
      return nm;
    };
    clone.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        if (col) o.material = Array.isArray(o.material) ? o.material.map(tintMat) : tintMat(o.material);
      }
    });
    return clone;
  }, [scene, targetH, tint]);

  return <primitive object={obj} {...props} />;
}
