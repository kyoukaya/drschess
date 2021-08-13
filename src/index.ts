import "./chess.js"

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
const t0 = Date.now();

const back = 1;
const debuff: [number, number] = [3, 2];
const r = 1;
const l = 3;

const [start, secondMoves] = Solve(back, debuff, [1 + r, 3 - l]);
const t1 = Date.now() - t0;
console.log(start, secondMoves);
console.log(t1);
