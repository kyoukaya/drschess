import * as chess from "./chess";

const minXY = 0;
const maxXY = 4;
const possibleDebuffs = [2, 3, 4];
const cardinalOffsets = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
]; // (x,y) tuple

class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  cartesianDistance(p: Point): number {
    return Math.abs(this.x - p.x) + Math.abs(this.y - p.y);
  }

  // bfs
  validPointsWithinN(n: number): Point[] {
    const validPoints: Point[] = [];
    const queue: Point[] = [this];
    const seen: Set<number> = new Set();
    seen.add(this.hash());
    while (true) {
      const p = queue.shift();
      if (p === undefined || p.cartesianDistance(this) > n) {
        break;
      }
      if (p.cartesianDistance(this) === n) {
        validPoints.push(p);
        continue;
      }
      for (const i of cardinalOffsets) {
        const newP = new Point(p.x + i[0], p.y + i[1]);
        if (!newP.isValid()) {
          continue;
        }
        const hash = newP.hash();
        if (!seen.has(hash)) {
          queue.push(newP);
          seen.add(hash);
        }
      }
    }
    return validPoints;
  }

  // simple hash for set operations
  hash(): number {
    return this.x * 10 + this.y;
  }

  isValid(): boolean {
    return (
      this.x >= minXY && this.x <= maxXY && this.y >= minXY && this.y <= maxXY
    );
  }
}

const endPoint = new Point(2, 4);

const openers = [
  new Map([
    [5, [new Point(1, 0), new Point(3, 0)]],
    [6, [new Point(0, 0), new Point(4, 0)]],
    [7, [new Point(1, 0), new Point(3, 0)]],
  ]),
  new Map([
    [5, [new Point(0, 1), new Point(4, 1)]],
    [6, [new Point(1, 1), new Point(3, 1)]],
    [7, [new Point(2, 1)]],
  ]),
];

const endPoints: Map<number, Set<number>> = new Map();

function initEndPoints() {
  for (const n of possibleDebuffs) {
    const x: Set<number> = new Set();
    for (const p of endPoint.validPointsWithinN(n)) {
      x.add(p.hash());
    }
    endPoints.set(n, x);
  }
}

// Only return a single starting position if there exists multiple. It'll be harder for the
// user to digest more than a single path anyway.
function Solve(
  row: number,
  debuff: [number, number],
  unsafe: [number, number]
): [Point, Point[]] {
  if (
    row < 0 ||
    debuff.length < 2 ||
    debuff[0] < 0 ||
    debuff[1] < 0 ||
    unsafe.length < 2 ||
    unsafe[0] < 0 ||
    unsafe[0] > 4 ||
    unsafe[1] < 0 ||
    unsafe[1] > 4
  ) {
    throw "not ready";
  }
  const tdebuff = debuff[0] + debuff[1];
  const endgame = endPoints.get(debuff[1]);
  if (endgame === undefined) {
    throw "missing endgame";
  }
  const starters = openers[row].get(tdebuff);
  if (starters === undefined) {
    throw "missing opener";
  }
  for (const startP of starters) {
    // technically we can precalc *everything*
    const p2 = startP.validPointsWithinN(debuff[0]);
    // filter unsafe
    const p3: Point[] = [];
    for (const p of p2) {
      if (p.x === unsafe[0] || p.x === unsafe[1]) {
        continue;
      }
      p3.push(p);
    }
    const p4: Point[] = [];
    for (const p of p3) {
      if (endgame.has(p.hash())) {
        p4.push(p);
      }
    }
    if (p4.length > 0) {
      return [startP, p4];
    }
  }
  throw "solution not found";
}

initEndPoints();
chess.drawEmptyChessboard();

const okEle = document.getElementById("ok");
const ngEle = document.getElementById("ng");
const wallBtn = document.getElementById("wall-btn");
const wallAwayBtn = document.getElementById("away-wall-btn");
const debuffA3Btn = document.getElementById("debuff1-2");
const debuffA4Btn = document.getElementById("debuff1-3");
const debuffA5Btn = document.getElementById("debuff1-4");
const debuffB3Btn = document.getElementById("debuff2-2");
const debuffB4Btn = document.getElementById("debuff2-3");
const debuffB5Btn = document.getElementById("debuff2-4");
const left1Btn = document.getElementById("left-1");
const left2Btn = document.getElementById("left-2");
const left3Btn = document.getElementById("left-3");
const right1Btn = document.getElementById("right-1");
const right2Btn = document.getElementById("right-2");
const right3Btn = document.getElementById("right-3");

okEle.hidden = true;
ngEle.hidden = false;

function solve(back: number, debuff: [number, number], r: number, l: number) {
  try {
    const [start, secondMoves] = Solve(back, debuff, [1 + r, 3 - l]);
    const second = secondMoves[0];
    chess.drawChessboard(start.x, start.y, second.x, second.y);
    console.log(
      "start: (%d,%d), second: (%d,%d)",
      start.x,
      start.y,
      second.x,
      second.y
    );
    okEle.hidden = false;
    ngEle.hidden = true;
  } catch (error) {
    console.log("path not generated:", error);
    okEle.hidden = true;
    ngEle.hidden = false;
  }
}

let back = -1;
let debuff: [number, number] = [-1, -1];
let r = -99;
let l = -99;

function btnListner(e: HTMLElement, f: Function) {
  e.addEventListener("click", function (this: HTMLElement, ev: MouseEvent) {
    f();
    solve(back, debuff, r, l);
  });
}

// how do i into javascript
btnListner(wallBtn, () => {
  back = 0;
});
btnListner(wallAwayBtn, () => {
  back = 1;
});
btnListner(debuffA3Btn, () => {
  debuff[0] = 2;
});
btnListner(debuffA4Btn, () => {
  debuff[0] = 3;
});
btnListner(debuffA5Btn, () => {
  debuff[0] = 4;
});
btnListner(debuffB3Btn, () => {
  debuff[1] = 2;
});
btnListner(debuffB4Btn, () => {
  debuff[1] = 3;
});
btnListner(debuffB5Btn, () => {
  debuff[1] = 4;
});
btnListner(left1Btn, () => {
  l = 1;
});
btnListner(left2Btn, () => {
  l = 2;
});
btnListner(left3Btn, () => {
  l = 3;
});
btnListner(right1Btn, () => {
  r = 1;
});
btnListner(right2Btn, () => {
  r = 2;
});
btnListner(right3Btn, () => {
  r = 3;
});
