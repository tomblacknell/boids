import { Vector } from './Vector';

export class Boid {
  id: number;
  pos: Vector;
  vel: Vector;
  
  constructor(id: number, pos: Vector, vel: Vector) {
    this.id = id;
    this.pos = pos;
    this.vel = vel;
  }
  
  getId() {
    return this.pos;
  }

  getPos() {
    return this.pos;
  }
}