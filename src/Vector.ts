export class Vector {
  private x: number;
  private y: number;
 
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  getX(): number {
    return this.x;
  };

  setX(x: number) {
    this.x = x;
  }

  getY(): number {
    return this.y;
  };

  setY(y: number) {
    this.y = y;
  }

  rev(): Vector {
    return new Vector(-this.x, -this.y);
  }

  add(b: Vector): Vector {
    return new Vector(this.x + b.getX(), this.y + b.getY());
  }

  sub(b: Vector): Vector {
    return this.add(b.rev());
  }

  mag(): number {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  divScalar(s: number): Vector {
    return new Vector(this.x / s, this.y / s);
  }

  mulScalar(s: number): Vector {
  return this.divScalar(1 / s);
  }
}