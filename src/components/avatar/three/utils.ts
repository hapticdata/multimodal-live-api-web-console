import * as THREE from "three";

export function applyShadows(obj: THREE.Object3D) {
  obj.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
    }
  });
}
