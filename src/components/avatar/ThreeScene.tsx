import { RefObject, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

let gltf: GLTF | null = null;
const loader = new GLTFLoader().setPath("/");

type ThreeSceneProps = {
  faceCanvasRef: RefObject<HTMLCanvasElement>;
};

export default function ThreeScene({ faceCanvasRef }: ThreeSceneProps) {
  const refs = useRef({
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.001,
      30000,
    ),
  });

  const frameId = useRef<number>(-1);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    console.log("useffect");
    if (canvasRef.current && faceCanvasRef.current) {
      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        // alpha: true,
        antialias: true,
      });

      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;

      renderer.setSize(window.innerWidth, window.innerHeight);

      const { scene, camera } = refs.current;
      const controls = new OrbitControls(camera, renderer.domElement);

      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      const sphere = new THREE.SphereGeometry(3, 4, 4);
      if (scene.children.length) {
        return;
      }
      const shadowMapSize = 512;
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);
      directionalLight.position.set(-2, 2, 2);
      directionalLight.lookAt(new THREE.Vector3());
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.set(shadowMapSize, shadowMapSize);
      scene.add(directionalLight);

      const directionalLight2 = new THREE.DirectionalLight(0xffffff, 3.25);
      //directionalLight2.position.set(1, 2, 1);
      directionalLight2.position.set(0, 5, 0);
      directionalLight2.lookAt(new THREE.Vector3());
      directionalLight2.castShadow = true;
      directionalLight2.shadow.mapSize.set(shadowMapSize, shadowMapSize);
      scene.add(directionalLight2);

      const ambientLight = new THREE.AmbientLight(0xdddddd, 1.05);
      scene.add(ambientLight);

      const canvasTexture = new THREE.CanvasTexture(faceCanvasRef.current);
      const planeMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        color: 0xffffff,
        map: canvasTexture,
      });
      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1, 4, 4),
        planeMaterial,
      );

      const room = new THREE.Mesh(
        new THREE.BoxGeometry(10, 12, 10),
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          metalness: 0.3,
          roughness: 0.5,
          emissive: 1,
          side: THREE.BackSide,
        }),
      );
      room.position.y = 2.5;
      room.receiveShadow = true;

      scene.add(room);

      // const skyColor = 0x5555cc;
      // const groundColor = 0x444444;
      // const hemisphereLight = new THREE.HemisphereLight(
      //   skyColor,
      //   groundColor,
      //   0.5,
      // );
      // scene.add(hemisphereLight);
      loader.load("Cheese_001-lowpoly.gltf", async function(_gltf) {
        if (gltf) {
          scene.remove(gltf.scene);
        }
        gltf = _gltf;
        console.log(gltf.scene);
        await renderer?.compileAsync(gltf.scene, camera, scene);
        const group = new THREE.Group();
        group.add(gltf.scene);
        const castShadowRecurse = (c: THREE.Object3D) => {
          c.castShadow = true;
          c.children.forEach(castShadowRecurse);
        };
        gltf.scene.children.forEach(castShadowRecurse);
        gltf.scene.castShadow = true;
        const scale = 2;
        gltf.scene.scale.set(scale, scale, scale);
        plane.position.z = scale;
        group.add(plane);
        group.position.y = -2;
        group.scale.set(1.5, 1.5, 1.5);

        scene.add(group);
      });
      camera.position.z = 12;
      camera.updateProjectionMatrix();
      camera.lookAt(new THREE.Vector3());

      const nextFrame = () => {
        controls.update();
        canvasTexture.needsUpdate = true;
        renderer.render(scene, camera);
        frameId.current = window.requestAnimationFrame(nextFrame);
      };

      nextFrame();
    }

    return () => {
      window.clearTimeout(frameId.current);
    };
  }, [canvasRef, faceCanvasRef]);

  return <canvas ref={canvasRef} />;
}
