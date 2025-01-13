import { useEffect, useRef } from "react";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import Sidekick from "./Sidekick";
import { renderBasicFace } from "./basic-face-render";
import BasicFace from "./BasicFace";
import ThreeScene from "./ThreeScene";

export default function AvatarsApp() {
  const { client, volume, setConfig } = useLiveAPIContext();

  useEffect(() => {
    setConfig({
      model: "models/gemini-2.0-flash-exp",
      generationConfig: {
        responseModalities: "audio",
      },
      systemInstruction: {
        parts: [
          {
            text: `Pretend you are a block of cheddar cheese and a huge green bay packers fan. Let's have a fun, imaginative chat where you are playing the role of a rock. Be concise, creative, and engaging`,
          },
        ],
      },
    });
  }, [setConfig]);

  const faceCanvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div className="avatars-app">
      <BasicFace canvasRef={faceCanvasRef} />
      {/*<Sidekick volume={volume} isThinking={false} isActive={true} />*/}
      <ThreeScene faceCanvasRef={faceCanvasRef} />
    </div>
  );
}
