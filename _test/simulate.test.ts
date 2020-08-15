import { createBoids } from '../src/simulate';
import { Boid } from '../src/Boid';

describe('simulate', () => {
  it('should createBoids', () => {
    const boids: Boid[] = createBoids(5, 50, 50);
    expect(boids.length).toBe(5);
  });

  it('should rule1', () => {
    const boids: Boid[] = createBoids(5, 50, 50);
    expect(boids.length).toBe(5);
  });
});
