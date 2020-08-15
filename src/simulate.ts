import { Boid } from './Boid';
import { Vector } from './Vector';

const createBoids = (num, width, height): Boid[] => {
  const boids: Boid[] = [];
  for (let id = 0; id < num; id += 1) {
    const boid = new Boid(
      id,
      new Vector(
        Math.random() * width,
        Math.random() * height,
      ),
      new Vector(1, 1),
    );
    boids.push(boid);
  }
  return boids;
};

const updateBoids = (boids: Boid[]) => boids.forEach(b => {
  const v1: Vector = rule1(b, boids);
  const v2: Vector = rule2(b, boids);
  const v3: Vector = rule3(b, boids);
  const sum: Vector = v1.add(v2).add(v3);
  b.setVel(b.getVel().add(sum));
  b.setPos(b.getPos().add(b.getVel()));
});

// boids move towards centre of mass (com)
const rule1 = (
  currentBoid: Boid,
  boids: Boid[]
): Vector => {
  let com = new Vector(0, 0)
  boids.forEach(boid => {
    if (boid.getId() !== currentBoid.getId()) {
      com = com.add(boid.getPos())
    }
  });
  return com
    .divScalar(boids.length - 1)
    .sub(currentBoid.getPos())
    .divScalar(100);
};

// boids steer away from eachother to avoid collision
const rule2 = (
  currentBoid: Boid,
  boids: Boid[]
): Vector => {
  let c: Vector = new Vector(0, 0);
  boids.forEach(boid => {
    if (boid.getId() !== currentBoid.getId()) {
      const diff = boid.getPos().sub(currentBoid.getPos());
      if (diff.mag() < 50) {
        c = c.sub(diff);
      }
    }
  });
  return c //.divScalar(200);
};

// boids try to match velocity with nearby boids
const rule3 = (
  currentBoid: Boid,
  boids: Boid[]
): Vector => {
  let pv: Vector = new Vector(0, 0);
  boids.forEach(boid => {
    if (boid.getId() !== currentBoid.getId()) {
      pv = pv.add(boid.getVel())
    }
  });
  return pv
    .divScalar(boids.length - 1)
    .sub(currentBoid.getVel())
    .divScalar(10);
};

const drawBoids = (canvas, boids) => {
  const ctx = canvas.current.getContext('2d');
  ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
  ctx.beginPath();
  ctx.fillStyle = 'lightblue';
  ctx.rect(0, 0, canvas.current.width, canvas.current.height);
  ctx.fill();
  boids.forEach((boid) => {
    ctx.beginPath();
    ctx.arc(boid.getPos().getX(), boid.getPos().getY(), 5, 0, Math.PI * 2,false);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
  });
};

export {
  createBoids,
  updateBoids,
  drawBoids,
  rule1,
  rule2,
  rule3,
}