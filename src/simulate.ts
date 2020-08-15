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
  const v3: Vector = rule3(b);
  const sum: Vector = v1.add(v2).add(v3);
  b.move(sum);
});

// boids move towards centre of the flock
const rule1 = (cBoid, boids): Vector => {
  // const centerOfMass = boids
  //   .filter(boid => boid.id !== cBoid.id)
  //   .reduce((acc, curr) => ([acc[0] + curr.x, acc[1] + curr.y]), [0, 0])
  //   .map(i => i / boids.length - 1);
  // return [(centerOfMass[0] - cBoid.x) / 100, (centerOfMass[1] - cBoid.y) / 100];
  // return [.01, .01];
  return new Vector(1, 1);
};

const distance = (v1, v2) => Math.sqrt((v1.x - v2.x) ^ 2 + (v1.y - v2.y) ^ 2);

// boids steer away from eachother if they get too close
const rule2 = (cBoid, boids): Vector => {
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
  return new Vector(0.1, 0.1);

};

const rule3 = (boid): Vector => {
  return new Vector(0.1, 0.1);
};

const drawBoids = (canvas, boids) => {
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

export {
  createBoids,
  updateBoids,
  drawBoids,
  rule1,
  rule2,
  rule3,
}