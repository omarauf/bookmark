export class DOMVector {
  readonly x: number;
  readonly y: number;
  readonly magnitudeX: number;
  readonly magnitudeY: number;

  constructor(x: number, y: number, magnitudeX: number, magnitudeY: number) {
    this.x = x;
    this.y = y;
    this.magnitudeX = magnitudeX;
    this.magnitudeY = magnitudeY;
  }

  toDOMRect(): DOMRect {
    return new DOMRect(
      Math.min(this.x, this.x + this.magnitudeX),
      Math.min(this.y, this.y + this.magnitudeY),
      Math.abs(this.magnitudeX),
      Math.abs(this.magnitudeY),
    );
  }

  getDiagonalLength(): number {
    return Math.sqrt(this.magnitudeX ** 2 + this.magnitudeY ** 2);
  }

  add(vector: DOMVector): DOMVector {
    return new DOMVector(
      this.x + vector.x,
      this.y + vector.y,
      this.magnitudeX + vector.magnitudeX,
      this.magnitudeY + vector.magnitudeY,
    );
  }

  clamp(vector: DOMRect): DOMVector {
    return new DOMVector(
      this.x,
      this.y,
      Math.min(vector.width - this.x, this.magnitudeX),
      Math.min(vector.height - this.y, this.magnitudeY),
    );
  }

  toTerminalPoint(): DOMPoint {
    return new DOMPoint(this.x + this.magnitudeX, this.y + this.magnitudeY);
  }
}

export function intersect(rect1: DOMRect, rect2: DOMRect) {
  if (rect1.right < rect2.left || rect2.right < rect1.left) return false;
  if (rect1.bottom < rect2.top || rect2.bottom < rect1.top) return false;
  return true;
}

export function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}
