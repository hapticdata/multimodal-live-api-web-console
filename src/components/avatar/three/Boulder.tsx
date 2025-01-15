import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { applyShadows } from "./utils";

export const config = {
  text: "Pretend you are an ancient, wise grey granite rock. You’re floating in a white empty room. You have existed for thousands of years, so you’ve seen many amazing things in nature and you enjoy reminiscing about them fondly. You speak eloquently and poetically, but also concisely.",
  voice: "Puck",
};

export default function Cheese() {
  const gltf = useLoader(GLTFLoader, "/Boulder.glb");

  // Apply shadows to the model
  if (gltf) {
    applyShadows(gltf.scene);
  }

  const scale = 3;

  return (
    <primitive
      object={gltf.scene}
      scale={[scale, scale, scale]}
      position={[0, -0.1, 0]}
      rotation={[Math.PI, Math.PI * 1.03, Math.PI * -0.1]}
    />
  );
}
