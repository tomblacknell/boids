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
      new Vector(
        (Math.random() * 10) - 5,
        (Math.random() * 10) - 5
      ),
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

const visualRange = 300;

// boids move towards local centre of mass (com)
const cohesion = (
  currentBoid: Boid,
  boids: Boid[]
): Vector => {
  let center = new Vector(0, 0)
  let boidsInRange = 0
  boids.forEach(boid => {
    if (currentBoid.getPos().distanceFrom(boid.getPos()) < visualRange) {
      center = center.add(boid.getPos())
      boidsInRange++
    }
  });
  if (boidsInRange) {
    return center
      .divScalar(boidsInRange)
      .sub(currentBoid.getPos())
      .divScalar(200)
  }
  return new Vector(0, 0)
};

// boids steer away from eachother to avoid collision
const separation = (
  currentBoid: Boid,
  boids: Boid[]
): Vector => {
  let move: Vector = new Vector(0, 0);
  boids.forEach(boid => {
    if (boid.getId() !== currentBoid.getId()) {
      // const diff = boid.getPos().sub(currentBoid.getPos());
      if (currentBoid.getPos().distanceFrom(boid.getPos()) < 50) {
        move = move.add(currentBoid.getPos().sub(boid.getPos()));
      }
    }
  });
  return move.divScalar(20);
};

// boids try to match velocity with nearby boids
const alignment = (
  currentBoid: Boid,
  boids: Boid[]
): Vector => {
  let avgV: Vector = new Vector(0, 0)
  let boidsInRange = 0
  boids.forEach(boid => {
    if (currentBoid.getPos().distanceFrom(boid.getPos()) < visualRange) {
      avgV = avgV.add(boid.getVel())
      boidsInRange++;
    }
  });
  if (boidsInRange) {
    return avgV
      .divScalar(boidsInRange)
      .sub(currentBoid.getVel())
      .divScalar(20);
  }
  return new Vector(0, 0);
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
  const limit: number = 6;
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
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.moveTo(boid.getPos().getX(), boid.getPos().getY());
    ctx.lineTo(boid.getPos().getX() + (boid.getVel().getX() * 5), boid.getPos().getY() + (boid.getVel().getY() * 5));
    ctx.stroke();
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