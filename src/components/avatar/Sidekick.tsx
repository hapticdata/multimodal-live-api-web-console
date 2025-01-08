import "./sidekick.sass";
import "events";
import { useCallback, useEffect, useRef, useState } from "react";
import c from "classnames";

const wanderRadius = 12;
const offset = 120;

const positions = [
  [],
  [[0, 0]],
  [
    [-offset, 0],
    [offset, 0],
  ],
  [
    [-offset, 0],
    [0, -offset],
    [0, offset],
    [offset, 0],
  ],
  [
    [-offset, -offset],
    [-offset, offset],
    [offset, -offset],
    [offset, offset],
  ],
];

const randPoint = () =>
  Math.random() * wanderRadius * (Math.random() > 0.5 ? 1 : -1);

type AgentProps = {
  volume: number;
  isThinking: boolean;
  isActive: boolean;
};

export default function Agent({ volume, isThinking, isActive }: AgentProps) {
  const isSpeaking = volume > 0;
  const [isBlinking, setIsBlinking] = useState(false);
  const [xy, setXy] = useState([0, 0]);
  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);
  const [bodySpinDelay, setBodySpinDelay] = useState(0);
  const [bodySpinSpeed, setBodySpinSpeed] = useState(0);
  const mouthRef = useRef<HTMLDivElement>(null);
  const blinkTimeout = useRef<number>();
  const unblinkTimeout = useRef<number>();
  const wanderTimeout = useRef<number>();
  const mouthTimeout = useRef<number>(-1);

  const blink = useCallback(() => {
    setIsBlinking(true);
    blinkTimeout.current = window.setTimeout(blink, Math.random() * 5333);
    unblinkTimeout.current = window.setTimeout(() => setIsBlinking(false), 533);
  }, []);

  const wander = useCallback(() => {
    setXy([randPoint(), randPoint()]);
    wanderTimeout.current = window.setTimeout(wander, Math.random() * 7333);
  }, []);

  const setBodyMovement = useCallback(() => {
    setBodySpinDelay(Math.random() * 3333);
    setBodySpinSpeed(2333 + Math.random() * 3333);
  }, []);

  const position = [0, 0];

  const updateMouth = useCallback(() => {
    if (!mouthRef.current || !isActive) {
      return;
    }

    mouthRef.current.style.scale = isSpeaking
      ? `1 ${0.2 + volume * 2.333}`
      : ".5 .3";

    mouthRef.current.style.transitionDuration = isSpeaking ? "50ms" : ".2s";
    mouthTimeout.current = window.requestAnimationFrame(updateMouth);
  }, [isActive, isSpeaking, volume]);

  useEffect(() => {
    const onResize = () =>
      setWindowSize([window.innerWidth, window.innerHeight]);

    onResize();
    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    blink();
    wander();
    updateMouth();
    setBodyMovement();

    return () => {
      clearTimeout(blinkTimeout.current);
      clearTimeout(wanderTimeout.current);
      clearTimeout(unblinkTimeout.current);
      window.cancelAnimationFrame(mouthTimeout.current);
    };
  }, [blink, wander, setBodyMovement, updateMouth, volume]);

  return (
    <div
      className={c("agent", {
        speaking: isSpeaking,
      })}
      style={{
        translate: `calc(-50% + ${xy[0]}px) calc(-50% + ${xy[1]}px)`,
        ...(position
          ? {
            left: windowSize[0] / 2 + position[0] + "px",
            top: windowSize[1] / 2 + position[1] + "px",
          }
          : {}),
      }}
    >
      <div className={c("agentThought", { active: isThinking })}>💭</div>

      <div
        className="body"
        style={{
          backgroundColor: "red",
          animationDelay: `${bodySpinDelay}ms`,
          animationDuration: `${bodySpinSpeed}ms`,
          boxShadow: `0 0 3px ${"salmon"}, 0 0 7px 0 rgba(0, 0, 0, .5)`,
        }}
      />
      <div className="face">
        <div className={c("eyes", { sleeping: false })}>
          <div className={c({ blink: isBlinking })} />
          <div className={c({ blink: isBlinking })} />
        </div>
        <div className="mouth" ref={mouthRef}>
          <img src="mouth.svg" alt="mouth" />
        </div>
      </div>
      <p className="agentName">
        {"kansas"}
        <button
          className="agentEditButton"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <span className="icon">edit</span>
        </button>
      </p>
    </div>
  );
}
