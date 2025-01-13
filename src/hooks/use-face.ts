import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useLiveAPIContext } from "../contexts/LiveAPIContext";

export type FaceResults = {
  eyesScale: number;
  mouthScale: number;
};

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function easeOutExpo(x: number): number {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

function easeInOutExpo(x: number): number {
  return x === 0
    ? 0
    : x === 1
      ? 1
      : x < 0.5
        ? Math.pow(2, 20 * x - 10) / 2
        : (2 - Math.pow(2, -20 * x + 10)) / 2;
}

function easeOutCirc(x: number): number {
  return Math.sqrt(1 - Math.pow(x - 1, 2));
}
function easeOutQuint(x: number): number {
  return 1 - Math.pow(1 - x, 5);
}

// Clamp function
function clamp(x: number, lowerlimit: number, upperlimit: number) {
  if (x < lowerlimit) x = lowerlimit;
  if (x > upperlimit) x = upperlimit;
  return x;
}

// Smoothstep function (GLSL's smoothstep equivalent)
function smoothstep(edge0: number, edge1: number, x: number) {
  // Scale, bias and saturate x to 0..1 range
  x = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
  // Evaluate polynomial
  return x * x * (3 - 2 * x);
}

type BlinkProps = {
  speed: number;
};

export function useBlink({ speed }: BlinkProps) {
  // const [numBlinks, setNumBlinks] = useState(0);
  // const [isBlinking, setIsBlinking] = useState(false);
  // const unblinkTimeout = useRef<number>();
  // const [isPending, startTransition] = useTransition();

  const [eyeScale, setEyeScale] = useState(1);
  const [frame, setFrame] = useState(0);

  const frameId = useRef(-1);

  useEffect(() => {
    function nextFrame() {
      frameId.current = window.requestAnimationFrame(() => {
        setFrame(frame + 1);
        let s = easeOutQuint((Math.sin(frame * speed) + 1) * 2);
        s = smoothstep(0.1, 0.25, s);
        s = Math.min(1, s);
        //s = s * (cycle > 0.8 ? 1 : 0);
        setEyeScale(s);
        nextFrame();
      });
    }

    nextFrame();

    return () => {
      // window.clearTimeout(blinkTimeout.current);
      window.cancelAnimationFrame(frameId.current);
    };
  }, [speed, eyeScale, frame]);

  // const blink = useCallback(() => {
  //   setIsBlinking(true);
  //   blinkTimeout.current = window.setTimeout(blink, Math.random() * 5333);
  //   unblinkTimeout.current = window.setTimeout(() => setIsBlinking(false), 533);
  // }, []);
  //
  return eyeScale;
}

export default function useFace() {
  const { volume } = useLiveAPIContext();
  const eyeScale = useBlink({ speed: 0.0125 });

  return { eyeScale, mouthScale: volume };
}
