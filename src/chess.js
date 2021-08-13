function drawChessboard() {
  let ctx = document.getElementById("canvasChessboard");
  resizeCanvasToDisplaySize(ctx)
  // size of each chess square
  const squareSize = ctx.clientWidth / 5;
  // position of board's top left
  ctx = ctx.getContext("2d");
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      ctx.fillStyle = ((i + j) % 2 == 0) ? "white" : "black";
      const xOffset = j * squareSize;
      const yOffset = i * squareSize;
      ctx.fillRect(xOffset, yOffset, squareSize, squareSize);
    }
  }
  ctx.fillStyle = "cyan";
  ctx.fillRect(2 * squareSize, 4 * squareSize, squareSize, squareSize);
  let img = document.getElementById("imagesource")
  const blobX = 2 * squareSize + 5
  const blobY = 0 * squareSize + 5
  ctx.drawImage(img, blobX, blobY)

  // https://github.com/frogcat/canvas-arrow
  const cp = [0, 5, -20, 5, -20, 15]
  ctx.fillStyle = "black";
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arrow(2.5 * squareSize, 0.5 * squareSize, 3.5 * squareSize, 2.5 * squareSize, cp);
  ctx.fill();

  ctx.beginPath();
  ctx.arrow(2.5 * squareSize, 0.5 * squareSize, 3.5 * squareSize, 2.5 * squareSize, cp);
  ctx.stroke();

  ctx.beginPath();
  ctx.arrow(3.5 * squareSize, 2.5 * squareSize, 2.5 * squareSize, 4.5 * squareSize, cp);
  ctx.fill();

  ctx.beginPath();
  ctx.arrow(3.5 * squareSize, 2.5 * squareSize, 2.5 * squareSize, 4.5 * squareSize, cp);
  ctx.stroke();
}

function resizeCanvasToDisplaySize(canvas) {
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
