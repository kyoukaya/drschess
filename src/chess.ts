import { arrow } from "./canvas-arrow/canvas-arrow";

function drawChessboard() {
  const canvas = <HTMLCanvasElement>document.getElementById("canvasChessboard");
  resizeCanvasToDisplaySize(canvas);
  // size of each chess square
  const squareSize = canvas.clientWidth / 5;
  // position of board's top left
  const ctx = canvas.getContext("2d");
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      ctx.fillStyle = (i + j) % 2 == 0 ? "white" : "black";
      const xOffset = j * squareSize;
      const yOffset = i * squareSize;
      ctx.fillRect(xOffset, yOffset, squareSize, squareSize);
    }
  }
  // draw goal
  ctx.fillStyle = "cyan";
  ctx.fillRect(2 * squareSize, 4 * squareSize, squareSize, squareSize);
  // draw start point
  let img = <CanvasImageSource>document.getElementById("imagesource");
  const blobX = 2 * squareSize + 5;
  const blobY = 0 * squareSize + 5;
  ctx.drawImage(img, blobX, blobY, squareSize - 10, squareSize - 10);

  // https://github.com/frogcat/canvas-arrow
  const cp = [0, 5, -20, 5, -20, 15];
  ctx.fillStyle = "black";
  ctx.strokeStyle = "white";
  ctx.lineWidth = 3;
  drawArrow(ctx, squareSize, 2, 0, 3, 2);
  drawArrow(ctx, squareSize, 3, 2, 2, 4);
  ctx.stroke();
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  squareSize: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number
) {
  ctx.beginPath();
  arrow(
    ctx,
    (x0 + 0.5) * squareSize,
    (y0 + 0.5) * squareSize,
    (x1 + 0.5) * squareSize,
    (y1 + 0.5) * squareSize,
    [0, 5, -20, 5, -20, 15]
  );
  ctx.fill();
  ctx.beginPath();
  arrow(
    ctx,
    (x0 + 0.5) * squareSize,
    (y0 + 0.5) * squareSize,
    (x1 + 0.5) * squareSize,
    (y1 + 0.5) * squareSize,
    [0, 5, -20, 5, -20, 15]
  );
  ctx.stroke();
}

function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement) {
  // look up the size the canvas is being displayed
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  // If it's resolution does not match change it
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height * 2;
    return true;
  }

  return false;
}

export { drawChessboard, resizeCanvasToDisplaySize };
