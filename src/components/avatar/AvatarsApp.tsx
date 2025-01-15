import { useEffect, useRef } from "react";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import "./avatars-app.scss";
import BasicFace from "./BasicFace";
import ThreeFiber from "./ThreeFiber";

export default function AvatarsApp() {
  const { client, volume, setConfig } = useLiveAPIContext();

  useEffect(() => {
    setConfig({
      model: "models/gemini-2.0-flash-exp",
      generationConfig: {
        responseModalities: "text",
      },
      systemInstruction: {
        parts: [
          {
            text: `Pretend you are a block of cheddar cheese and a huge green bay packers fan. Let's have a fun, imaginative chat where you are playing the role of a rock. Be concise, creative, and engaging`,
          },
        ],
      },
      tools: [{ googleSearch: {} }],
    });
  }, [setConfig]);

  const faceCanvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div className="avatars-app">
      <BasicFace canvasRef={faceCanvasRef} />
      {/*<Sidekick volume={volume} isThinking={false} isActive={true} />*/}
      {/*<ThreeScene faceCanvasRef={faceCanvasRef} />*/}
      <ThreeFiber faceCanvasRef={faceCanvasRef} />
    </div>
  );
}
