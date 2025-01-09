import { useEffect, useRef } from "react";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import Sidekick from "./Sidekick";
import { renderBasicFace } from "./basic-face-render";
import BasicFace from "./BasicFace";

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
            text: `Pretend you are a rock. Let's have a fun, imaginative chat where you are playing the role of a rock. Be concise, creative, and engaging`,
          },
        ],
      },
    });
  }, [setConfig]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div className="avatars-app">
      <BasicFace canvasRef={canvasRef} />
      <Sidekick volume={volume} isThinking={false} isActive={true} />
    </div>
  );
}
