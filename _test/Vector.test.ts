import { Vector } from '../src/Vector';

describe('Vector', () => {
  it('should initialize to 0, 0', () => {
    const v: Vector = new Vector(0, 0);
    expect(v.getX()).toBe(0);
    expect(v.getY()).toBe(0);
  })
})