import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { applyShadows } from "./utils";

export default function Cheese() {
  const gltf = useLoader(GLTFLoader, "/Mug.glb");

  // Apply shadows to the model
  if (gltf) {
    applyShadows(gltf.scene);
  }

  return (
    <primitive
      object={gltf.scene}
      scale={[0.06, 0.06, 0.06]}
      position={[0, -2, 0]}
      rotation={[0, Math.PI * 1.33, 0]}
    />
  );
}
