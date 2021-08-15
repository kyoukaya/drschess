import { arrow } from "./canvas-arrow/canvas-arrow";

const canvas = <HTMLCanvasElement>document.getElementById("canvasChessboard");
function drawEmptyChessboard(): CanvasRenderingContext2D {
  const squareSize = canvas.clientWidth / 5;
  resizeCanvasToDisplaySize(canvas);
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
  ctx.fillRect(2 * squareSize, 0 * squareSize, squareSize, squareSize);
  return ctx;
}

function drawChessboard(
  startX: number,
  startY: number,
  moveX: number,
  moveY: number
) {
  startX = 4 - startX;
  startY = 4 - startY;
  moveX = 4 - moveX;
  moveY = 4 - moveY;
  const ctx = drawEmptyChessboard();
  // size of each chess square
  const squareSize = canvas.clientWidth / 5;
  // position of board's top left
  let img = <CanvasImageSource>document.getElementById("imagesource");
  const blobX = startX * squareSize + 5;
  const blobY = startY * squareSize + 5;
  ctx.drawImage(img, blobX, blobY, squareSize - 10, squareSize - 10);

  ctx.fillStyle = "black";
  ctx.strokeStyle = "white";
  ctx.lineWidth = 3;
  drawArrow(ctx, squareSize, startX, startY, moveX, moveY);
  drawArrow(ctx, squareSize, moveX, moveY, 2, 0);
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

export { drawChessboard, drawEmptyChessboard };
