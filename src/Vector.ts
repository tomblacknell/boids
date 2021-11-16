export class Vector {
  private x: number;
  private y: number;
  private z: number;
 
  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
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

  setZ(z: number) {
    this.z = z;
  }

  getZ(): number {
    return this.z;
  }

  rev(): Vector {
    return new Vector(-this.x, -this.y, -this.z);
  }

  add(b: Vector): Vector {
    return new Vector(this.x + b.getX(), this.y + b.getY(), this.z + b.getZ());
  }

  sub(b: Vector): Vector {
    return this.add(b.rev());
  }

  mag(): number {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
  }

  distanceFrom(b: Vector): number {
    return Math.sqrt(Math.pow(this.x - b.getX(), 2) + Math.pow(this.y - b.getY(), 2) + Math.pow(this.z - b.getZ(), 2));
  }

  divScalar(s: number): Vector {
    return new Vector(this.x / s, this.y / s, this.z / s);
  }

  mulScalar(s: number): Vector {
  return this.divScalar(1 / s);
  }
}