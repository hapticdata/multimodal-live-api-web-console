import * as THREE from "three";
import * as f from "@react-three/fiber";
import { IcosahedronGeometry } from "three";

export default function Icosahedron() {
  return (
    <mesh position={[0, 0, 0]} rotation={[Math.PI * 0.6, 0, 0]} castShadow>
      <icosahedronGeometry args={[2, 0]} />
      <meshStandardMaterial
        color={0x1f94ff * 1.2}
        emissive={0x72534}
        transparent={true}
        metalness={0.7}
        flatShading={true}
      />
    </mesh>
  );
}
