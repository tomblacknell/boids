import { RefObject } from 'react';

import { Boid } from './Boid';
import { Vector } from './Vector';
import Rule from './Rule';

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

const updateBoids = (
  boids: Boid[],
  canvasRef: RefObject<HTMLCanvasElement>,
  controls: { [rule: string]: Rule },
) => boids.forEach(b => {
  if (canvasRef.current) {
    const { width, height } = canvasRef.current;
    let sum: Vector = new Vector(0, 0);
    if (controls.rule1.enabled) {
      sum = sum.add(cohesion(b, boids));
    }
    if (controls.rule2.enabled) {
      sum = sum.add(separation(b, boids))
    }
    if (controls.rule3.enabled) {
      sum = sum.add(alignment(b, boids))
    }
    if (controls.rule4.enabled) {
      sum = sum.add(boundPosition(b, width, height));
    }
    b.setVel(b.getVel().add(sum));
    if (controls.rule5.enabled) {
      limitVelocity(b);
    }
    b.setPos(b.getPos().add(b.getVel()));
  }
});

// boids move towards centre of mass (com)
const cohesion = (
  currentBoid: Boid,
  boids: Boid[]
): Vector => {
  let com = new Vector(0, 0)
  // console.log('cohesion')
  // const visibleBoids = boids.filter(
  // boid => boid.getPos().sub(currentBoid.getPos()).mag() < 200)
  let boidsInRange = 0;
  boids.forEach(boid => {
    if (boid.getId() !== currentBoid.getId()) {
      if (boid.getPos().sub(currentBoid.getPos()).mag() < 300) {
        com = com.add(boid.getPos())
        boidsInRange++;
      }
    }
  });
  return com
    .divScalar(boidsInRange > 1 ? boidsInRange - 1 : 1)
    .sub(currentBoid.getPos())
    .divScalar(1000);
};

// boids steer away from eachother to avoid collision
const separation = (
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
  return c.divScalar(300);
};

// boids try to match velocity with nearby boids
const alignment = (
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

// keep boids from leaving the canvas
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

const limitVelocity = (b: Boid) => {
  const limit: number = 3;
  const vel = b.getVel();
  if (vel.mag() > limit) {
    b.setVel(vel.divScalar(vel.mag()).mulScalar(limit))
  }
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
    ctx.arc(boid.getPos().getX(), boid.getPos().getY(), 8, 0, Math.PI * 2, false);
    ctx.fillStyle = '#fdcece';
    ctx.fill();
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
  cohesion,
  separation,
  alignment,
}