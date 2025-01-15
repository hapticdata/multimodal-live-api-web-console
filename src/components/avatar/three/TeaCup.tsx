import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { applyShadows } from "./utils";

export default function Cheese() {
  const gltf = useLoader(GLTFLoader, "/TeaCup.glb");

  // Apply shadows to the model
  if (gltf) {
    applyShadows(gltf.scene);
  }

  return (
    <primitive
      object={gltf.scene}
      scale={[0.03, 0.03, 0.03]}
      position={[0, -1, 0]}
      rotation={[Math.PI * 1.5, 0, 0]}
    />
  );
}
