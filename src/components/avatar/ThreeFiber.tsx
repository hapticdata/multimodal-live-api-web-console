import { RefObject, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls, RoundedBox } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import useWander from "../../hooks/use-wander";

type ThreeSceneProps = {
  faceCanvasRef: RefObject<HTMLCanvasElement>;
};

function Room() {
  return (
    <RoundedBox
      args={[40, 18, 40]}
      radius={8.5}
      position={[0, 2.5, 0]}
      receiveShadow
    >
      <meshStandardMaterial
        color={0xffffff}
        metalness={0.1}
        roughness={1.5}
        emissive={1}
        side={THREE.BackSide}
      />
    </RoundedBox>
  );
}

function Model({
  faceCanvasRef,
}: {
  faceCanvasRef: RefObject<HTMLCanvasElement>;
}) {
  const gltf = useLoader(GLTFLoader, "/Cheese_001-lowpoly.gltf");
  const groupRef = useRef<THREE.Group>(null);
  const wander = useWander({ radius: 0.25, speed: 0.001 });

  // Apply shadows to the model
  if (gltf) {
    gltf.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
      }
    });
  }

  // Create canvas texture for the face
  const canvasTexture = new THREE.CanvasTexture(faceCanvasRef.current!);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.x = wander.x;
      groupRef.current.position.z = wander.y;
      canvasTexture.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} position={[0, -2, 0]} scale={[1.5, 1.5, 1.5]}>
      <primitive object={gltf.scene} scale={[2, 2, 2]} />
      <mesh position={[0, 0, 2]}>
        <planeGeometry args={[1, 1, 4, 4]} />
        <meshBasicMaterial transparent color={0xffffff} map={canvasTexture} />
      </mesh>
    </group>
  );
}

function Lights() {
  const shadowMapSize = 512;

  return (
    <>
      <directionalLight
        position={[-2, 2, 2]}
        intensity={0.25}
        castShadow
        shadow-mapSize={[shadowMapSize, shadowMapSize]}
      />
      <directionalLight
        position={[0, 5, 0]}
        intensity={3.25}
        castShadow
        shadow-mapSize={[shadowMapSize, shadowMapSize]}
      />
      <ambientLight intensity={1.05} color={0xdddddd} />
    </>
  );
}

export default function ThreeFiber({ faceCanvasRef }: ThreeSceneProps) {
  return (
    <Canvas
      style={{ width: "100vw", height: "100vh" }}
      shadows
      camera={{ position: [0, 0, 24], fov: 45, near: 0.001, far: 30000 }}
    >
      <OrbitControls />
      <Lights />
      <Room />
      <Model faceCanvasRef={faceCanvasRef} />
    </Canvas>
  );
}
