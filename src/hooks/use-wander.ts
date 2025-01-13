import { useEffect, useRef, useState } from "react";

interface WanderProps {
  radius: number;
  speed: number;
}

interface Position {
  x: number;
  y: number;
}

export default function useWander({ radius, speed }: WanderProps) {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [angle, setAngle] = useState(Math.random() * Math.PI * 2);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const animate = () => {
      // Add some randomness to the angle
      setAngle((prevAngle) => {
        const newAngle = prevAngle + (Math.random() - 0.5) * 0.5;
        return newAngle;
      });

      setPosition((prevPos) => {
        // Calculate new position
        const newX = prevPos.x + Math.cos(angle) * speed;
        const newY = prevPos.y + Math.sin(angle) * speed;

        // Keep within radius bounds using distance from center
        const distance = Math.sqrt(newX * newX + newY * newY);
        if (distance > radius) {
          // If exceeding radius, normalize position back to radius
          const scale = radius / distance;
          return {
            x: newX * scale,
            y: newY * scale,
          };
        }

        return { x: newX, y: newY };
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [radius, angle]);

  return position;
}
