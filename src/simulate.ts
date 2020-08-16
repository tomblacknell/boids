import { Boid } from './Boid';
import { Vector } from './Vector';
import { RefObject } from 'react';

const createBoids = (num, width, height): Boid[] => {
  const boids: Boid[] = [];
  for (let id = 0; id < num; id += 1) {
    const boid = new Boid(
      id,
      new Vector(
        Math.random() * width,
        Math.random() * height,
      ),
      new Vector(0, 0),
    );
    boids.push(boid);
  }
  return boids;
};

const updateBoids = (boids: Boid[], canvasRef: RefObject<HTMLCanvasElement>) => boids.forEach(b => {
  if (canvasRef.current) {
    const { width, height } = canvasRef.current;
    const sum: Vector = rule1(b, boids)
      .add(rule2(b, boids))
      .add(rule3(b, boids))
      .add(boundPosition(b, width, height));
    b.setVel(b.getVel().add(sum));
    b.setPos(b.getPos().add(b.getVel()));
  }
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
    .divScalar(1000);
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
      if (diff.mag() < 75) {
        c = c.sub(diff);
      }
    }
  });
  return c.divScalar(100);
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

const boundPosition = (boid: Boid, xMax: number, yMax: number): Vector => {
  let v: Vector = new Vector(0, 0);
  const displace: number = 10;
  if (boid.getPos().getX() < 0) {
    v.setX(displace);
  } else if (boid.getPos().getX() > xMax) {
    v.setX(-displace);
  }

  if (boid.getPos().getY() < 0) {
    v.setY(displace);
  } else if (boid.getPos().getY() > yMax) {
    v.setY(-displace);
  }

  return v;
}

const drawBoids = (canvas, boids) => {
  const ctx = canvas.current.getContext('2d');
  ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
  ctx.beginPath();
  ctx.fillStyle = '#000';
  ctx.rect(0, 0, canvas.current.width, canvas.current.height);
  ctx.fill();
  boids.forEach((boid) => {
    ctx.beginPath();
    ctx.arc(boid.getPos().getX(), boid.getPos().getY(), 4, 0, Math.PI * 2, false);
    ctx.fillStyle = '#fc0303';
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