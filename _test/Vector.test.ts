import { Vector } from '../src/Vector';

describe('Vector', () => {
  it('should initialize to (0, 0)', () => {
    const v: Vector = new Vector(0, 0);
    expect(v.getX()).toBe(0);
    expect(v.getY()).toBe(0);
  })

  it('should reverse (3, 3)', () => {
    const v: Vector = new Vector(3, 3).rev();
    expect(v.getX()).toBe(-3);
    expect(v.getY()).toBe(-3);
  })

  it('should add (3, -3) to (-1, 0)', () => {
    const v: Vector = new Vector(-1, 0)
      .add(new Vector(3, -3));
    expect(v.getX()).toBe(2);
    expect(v.getY()).toBe(-3);
  })

  it('should subtract (4, 5) from (12, 2)', () => {
    const v: Vector = new Vector(12, 2)
      .sub(new Vector(4, 5));
    expect(v.getX()).toBe(8);
    expect(v.getY()).toBe(-3);
  })

  it('should get magnitude of (6, 8)', () => {
    const mag: number = new Vector(6, 8).mag();
    expect(mag).toBe(10);
  })

  it('should divide (10, 12) by 2', () => {
    const v: Vector = new Vector(10, 12).divScalar(2);
    expect(v.getX()).toBe(5);
    expect(v.getY()).toBe(6);
  })
})