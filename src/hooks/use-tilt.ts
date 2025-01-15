import { useEffect, useRef, useState } from "react";

export type UseTiltProps = {
  min: number;
  max: number;
  frequency: number;
  amplitude: number;
};

/**
 * map a value from one domain of numbers to another,
 * i.e. scalemap(0.5, 0, 2, 10, 20) = 12.5
 * @param value
 * @param start1
 * @param stop1
 * @param start2
 * @param stop2
 */
export function scalemap(
  value: number,
  start1: number,
  stop1: number,
  start2: number,
  stop2: number,
): number {
  return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

export default function useTilt({
  min,
  max,
  frequency,
  amplitude,
}: UseTiltProps) {
  const [angle, setAngle] = useState<number>(0);
  const animationFrameRef = useRef<number>();
  const [frame, setFrame] = useState<number>(0);
  const [currentAmplitude, setAmplitude] = useState(0);

  useEffect(() => {
    const animate = () => {
      // Add some randomness to the angle
      setAngle((prevAngle) => {
        //const newAngle = prevAngle + (Math.random() - 0.5) * 0.5;
        const usedAmplitude =
          currentAmplitude + (amplitude - currentAmplitude) * 0.015;
        const newAngle = Math.cos((frame / 10) * frequency);
        setAmplitude(usedAmplitude);
        //   return Math.min(
        //     _max,
        //     Math.max(_min, scalemap(newAngle, -1, 1, min, max)),
        //   );
        return scalemap(
          newAngle,
          -1,
          1,
          min * usedAmplitude,
          max * usedAmplitude,
        );
      });
      setFrame(frame + 1);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    animationFrameRef,
    setFrame,
    frame,
    max,
    min,
    frequency,
    amplitude,
    currentAmplitude,
  ]);

  return angle;
}
