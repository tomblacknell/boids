import { Vector } from './Vector';

export class Boid {
  private id: number;
  private pos: Vector;
  private vel: Vector;
  
  constructor(id: number, pos: Vector, vel: Vector) {
    this.id = id;
    this.pos = pos;
    this.vel = vel;
  }
  
  getId(): number {
    return this.id;
  }

  getPos(): Vector {
    return this.pos;
  }

  getVel(): Vector {
    return this.vel;
  }

  move(v: Vector) {
    this.pos = this.pos.add(v);
  }
}