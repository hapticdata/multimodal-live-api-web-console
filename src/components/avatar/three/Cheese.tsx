import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function Cheese() {
  const gltf = useLoader(GLTFLoader, "/Cheese_001-lowpoly.gltf");

  // Apply shadows to the model
  if (gltf) {
    gltf.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
      }
    });
  }

  return <primitive object={gltf.scene} scale={[2, 2, 2]} />;
}
