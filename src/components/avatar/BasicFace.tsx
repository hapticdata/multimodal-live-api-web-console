import { MutableRefObject, RefObject, useEffect } from "react";
import { renderBasicFace } from "./basic-face-render";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import useFace from "../../hooks/use-face";

type BasicFaceProps = {
  canvasRef: RefObject<HTMLCanvasElement>;
};

export default function BasicFace({ canvasRef }: BasicFaceProps) {
  const { volume } = useLiveAPIContext();
  const { eyeScale, mouthScale } = useFace();

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d")!;
    renderBasicFace({ ctx, mouthScale, eyeScale: eyeScale });
  }, [canvasRef, volume, eyeScale, mouthScale]);
  return <canvas ref={canvasRef} width={400} height={400} />;
}
