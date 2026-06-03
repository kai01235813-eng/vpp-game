// 절차적 변전소 — 울타리 야드 + 변압기 + 소형 철탑
export default function Substation() {
  return (
    <group>
      {/* 부지 */}
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <boxGeometry args={[1.6, 0.08, 1.2]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>
      {/* 변압기 2기 */}
      {[-0.35, 0.35].map((x, i) => (
        <group key={i} position={[x, 0, -0.1]}>
          <mesh position={[0, 0.3, 0]} castShadow>
            <boxGeometry args={[0.45, 0.5, 0.45]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.4} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.62, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.22, 6]} />
            <meshStandardMaterial color="#e2e8f0" />
          </mesh>
        </group>
      ))}
      {/* 소형 철탑(부싱) */}
      <group position={[0.45, 0, 0.4]}>
        <mesh position={[0, 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.08, 0.9, 6]} />
          <meshStandardMaterial color="#9ca3af" />
        </mesh>
        <mesh position={[0, 0.9, 0]}>
          <boxGeometry args={[0.4, 0.05, 0.05]} />
          <meshStandardMaterial color="#9ca3af" />
        </mesh>
      </group>
      {/* 상태 LED */}
      <mesh position={[-0.55, 0.2, 0.45]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1} />
      </mesh>
    </group>
  );
}
