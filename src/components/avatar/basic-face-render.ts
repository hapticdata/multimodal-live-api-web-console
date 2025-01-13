type BasicFaceProps = {
  ctx: CanvasRenderingContext2D;
  mouthScale: number;
  eyeScale: number;
};

export function renderBasicFace(props: BasicFaceProps) {
  const { ctx, eyeScale: eyesOpenness, mouthScale: mouthOpenness } = props;
  const { width, height } = ctx.canvas;

  ctx.clearRect(0, 0, width, height);

  ctx.strokeStyle = "white";
  // ctx.strokeRect(0, 0, width, height);

  const eyesCenter = [width / 2, height / 3];
  const eyesOffset = width / 6;
  const eyeRadius = width / 10;
  const eyesPosition: Array<[number, number]> = [
    [eyesCenter[0] - eyesOffset, eyesCenter[1]],
    [eyesCenter[0] + eyesOffset, eyesCenter[1]],
  ];

  ctx.fillStyle = "black";
  eye(ctx, eyesPosition[0], eyeRadius, eyesOpenness + 0.1);
  eye(ctx, eyesPosition[1], eyeRadius, eyesOpenness + 0.1);

  const mouthCenter = [width / 2, (height / 3) * 2];
  const mouthExtent = [width / 4, (height / 5) * mouthOpenness + 10];
  ctx.save();
  ctx.translate(mouthCenter[0], mouthCenter[1]);
  ctx.scale(1, mouthOpenness + 0.6 * 1.4);
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.ellipse(0, 0, mouthExtent[0], mouthExtent[1], 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // ctx.fillRect(
  //   mouthCenter[0] - mouthExtent[0],
  //   mouthCenter[1] - mouthExtent[1],
  //   mouthExtent[0] * 2,
  //   mouthExtent[1] * 2,
  // );

  // ctx.save();
  // ctx.translate(width / 2, height / 2);
  // ctx.scale(4, 4);
  // drawSvgPathOnCanvas(
  //   ctx,
  //   "M32 9.01404C32 17.8428 24.8366 25 16 25C7.16344 25 0 17.8428 0 9.01404C0 0.185248 7.16344 0 16 0C24.8366 0 32 0.185248 32 9.01404Z",
  // );
  // ctx.restore();
}

const eye = (
  ctx: CanvasRenderingContext2D,
  pos: [number, number],
  radius: number,
  scaleY: number,
) => {
  ctx.save();
  ctx.translate(pos[0], pos[1]);
  ctx.scale(1, scaleY);
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.restore();
  ctx.fill();
};

function drawSvgPathOnCanvas(ctx: CanvasRenderingContext2D, pathData: string) {
  if (!ctx) {
    console.error("Canvas context not available.");
    return;
  }

  ctx.beginPath();

  const commands = pathData.match(/([MCLHVCSQTAZ])([^MCLHVCSQTAZ]*)/gi);
  if (commands) {
    for (const command of commands) {
      const type = command[0];
      const args = command
        .slice(1)
        .trim()
        .split(/\s*[,\s]\s*/)
        .filter((arg) => arg !== "")
        .map(Number);
      switch (type) {
        case "M":
          ctx.moveTo(args[0], args[1]);
          break;
        case "C":
          ctx.bezierCurveTo(
            args[0],
            args[1],
            args[2],
            args[3],
            args[4],
            args[5],
          );
          break;
        case "Z":
          ctx.closePath();
          break;
        default:
          console.warn(`Unkown path command ${type}`);
      }
    }
  } else {
    console.warn("Invalid path data");
  }
  ctx.fill();
}
