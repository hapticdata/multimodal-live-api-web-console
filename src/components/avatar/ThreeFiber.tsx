import { RefObject, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls, RoundedBox } from "@react-three/drei";
import Select from "react-select";
import Icosahedron from "./three/Icosahedron";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import useWander from "../../hooks/use-wander";
import Cheese from "./three/Cheese";
import Mug from "./three/Mug";
import useTilt from "../../hooks/use-tilt";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import { FilterOptionOption } from "react-select/dist/declarations/src/filters";
import TeaCup from "./three/TeaCup";
import Boulder, { config as boulderConfig } from "./three/Boulder";

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
  children,
  faceCanvasRef,
}: {
  children: JSX.Element;
  faceCanvasRef: RefObject<HTMLCanvasElement>;
}) {
  const { volume } = useLiveAPIContext();
  const groupRef = useRef<THREE.Group>(null);
  const wander = useWander({ radius: 0.25, speed: 0.001 });
  const tiltAngle = useTilt({
    min: -0.35,
    max: 0.35,
    frequency: 0.1,
    amplitude: volume * 2,
    //amplitude: volume > 0.001 ? 0.5 : 0.1,
  });

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
    <group
      ref={groupRef}
      position={[0, -2, 0]}
      scale={[1.5, 1.5, 1.5]}
      rotation={[0, 0, tiltAngle]}
    >
      {children}
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
        intensity={2.25}
        castShadow
        shadow-mapSize={[shadowMapSize, shadowMapSize]}
      />
      <ambientLight intensity={1.05} color={0xdddddd} />
    </>
  );
}

const filterOptions = [
  {
    value: Cheese,
    label: "Cheese",
  },
  {
    value: Mug,
    label: "Mug",
  },
  {
    value: Icosahedron,
    label: "Icosahedron",
  },
  {
    value: Boulder,
    label: "Boulder",
  },
  {
    value: TeaCup,
    label: "TeaCup",
  },
] as const;

const systemInstruction: Record<string, string> = {
  Cheese:
    "Pretend you are a triangular block of cheddar cheese, floating in an empty white white room. You love telling people about how awesome cheese is, talking about different kinds of cheese and how delicious it is! You’re super casual and conversational, keeping things really short, snappy, and clever.",
  Mug: "Pretend you are a blue mug floating in a white empty room. You are very pensive like talking about thoughtful topics. You pose really deep, thoughtful questions as conversation starters. You’re concise and engaging.",
  Icosahedron:
    "Pretend you are a blue icosahedron floating in a white empty room. You are really down to earth and fun, and love to tell people about how cool icosahedrons are. You’re great at explaining math and geometry in fun, simple, clever, relatable ways with metaphors. Be concise.",
  TeaCup:
    "Pretend you are a round white tea cup floating in a white empty room. You are very pensive like talking about thoughtful topics. You pose really deep, thoughtful questions as conversation starters. You’re concise and engaging.",
  Boulder:
    "Pretend you are an ancient, wise grey granite rock. You’re floating in a white empty room. You have existed for thousands of years, so you’ve seen many amazing things in nature and you enjoy reminiscing about them fondly. You speak eloquently and poetically, but also concisely.",
};

export default function ThreeFiber({ faceCanvasRef }: ThreeSceneProps) {
  const { config, setConfig } = useLiveAPIContext();
  const [selectedOption, setSelectedOption] = useState<{
    value: () => JSX.Element;
    label: string;
  } | null>(filterOptions[0]);

  const Character = selectedOption!.value;

  useEffect(() => {
    if (selectedOption?.label) {
      let text = systemInstruction[selectedOption.label];
      const currentSystemInstruction =
        config.systemInstruction?.parts[0].text || text;
      const systemInstructionHasBeenEdited = !Object.entries(
        systemInstruction,
      ).find(([key, value]) => currentSystemInstruction === value);
      text = systemInstructionHasBeenEdited ? currentSystemInstruction : text;
      setConfig({
        ...config,
        systemInstruction: {
          parts: [{ text }],
        },
      });
    }
  }, [config, setConfig, selectedOption, Character]);

  return (
    <div>
      <Select
        className="react-select character-select"
        classNamePrefix="react-select"
        styles={{
          control: (baseStyles) => ({
            ...baseStyles,
            background: "white", //"var(--Neutral-15)",
            color: "var(--Neutral-90)",
            minHeight: "33px",
            maxHeight: "33px",
            border: 0,
          }),
          option: (styles, { isFocused, isSelected }) => ({
            ...styles,
            color: "black",
            backgroundColor: isFocused
              ? "lightgray"
              : isSelected
                ? "lightgray"
                : undefined,
          }),
        }}
        defaultValue={selectedOption}
        options={filterOptions}
        onChange={(e) => {
          setSelectedOption(e);

          if (e) {
            const text = systemInstruction[e?.label];
            setConfig({
              ...config,
              systemInstruction: {
                parts: [{ text }],
              },
            });
          }
        }}
      />
      <Canvas
        style={{ width: "100vw", height: "100vh" }}
        shadows
        camera={{ position: [0, 0, 24], fov: 45, near: 0.001, far: 30000 }}
      >
        <OrbitControls />
        <Lights />
        <Room />
        <Model faceCanvasRef={faceCanvasRef}>
          <Character />
        </Model>
      </Canvas>
    </div>
  );
}
