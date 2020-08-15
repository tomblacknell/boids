import Boid from './Boid';
import { Vector } from './Vector';

export const createBoids = (width, height): Boid[] => {
  const boids: Boid[] = [];
  for (let id = 0; id < 15; id += 1) {
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

export const updateBoids = (boids) => {
  const updatedBoids = [];
  boids.forEach(boid => {
    const v1 = rule1(boid, boids);
    const v2 = rule2(boid, boids);
    const v3 = rule3(boid);
    const newV = [
      boid.v[0] + v1[0] + v2[0] + v3[0],
      boid.v[1] + v1[1] + v2[1] + v3[1],
    ];
    updatedBoids.push({
      ...boid,
      v: newV,
      x: boid.x + newV[0],
      y: boid.y + newV[1],
    });
  });
  return updatedBoids;
};

// boids move towards centre of the flock
const rule1 = (cBoid, boids) => {
  // const centerOfMass = boids
  //   .filter(boid => boid.id !== cBoid.id)
  //   .reduce((acc, curr) => ([acc[0] + curr.x, acc[1] + curr.y]), [0, 0])
  //   .map(i => i / boids.length - 1);
  // return [(centerOfMass[0] - cBoid.x) / 100, (centerOfMass[1] - cBoid.y) / 100];
  return [.01, .01];
};

const distance = (v1, v2) => Math.sqrt((v1.x - v2.x) ^ 2 + (v1.y - v2.y) ^ 2);

// boids steer away from eachother if they get too close
const rule2 = (cBoid, boids) => {
  // let move = [0, 0];
  // boids
  //   .filter(boid => boid.id !== cBoid.id)
  //   .filter(boid => distance(boid, cBoid) < 1000)
  //   .forEach(boid => {
  //     const dist = distance(boid, cBoid);
  //     const diff = [
  //       Math.abs(boid.x - cBoid.x),
  //       Math.abs(boid.y - cBoid.y)
  //     ];
  //     const mag = Math.sqrt(diff[0] ^ 2 + diff[1] ^ 2);
  //     const normDiff = [
  //       diff[0] / mag,
  //       diff[1] / mag
  //     ]
  //     const finalDiff = [
  //       normDiff[0] / dist,
  //       normDiff[1] / dist
  //     ]
  //     move = [(move[0] + finalDiff[0]), (move[1] + finalDiff[1])]
  //   });
  // return move;
  return [.01, .01];

};

const rule3 = (boid) => {
  return [.01, .01];
};

export const drawBoids = (canvas, boids) => {
  console.log("draw");
  const ctx = canvas.current.getContext('2d');
  ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
  ctx.beginPath();
  ctx.fillStyle = 'lightblue';
  ctx.rect(0, 0, canvas.current.width, canvas.current.height);
  ctx.fill();
  boids.forEach((boid) => {
    ctx.beginPath();
    ctx.arc(boid.x, boid.y, 5, 0, Math.PI * 2, false);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
  });
};