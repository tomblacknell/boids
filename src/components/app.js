/* eslint-disable no-undef */
import React, { useRef, useEffect, useState } from 'react';

const App = () => {
  const canvas = useRef(null);

  const fixDpi = (dpi) => {
    const styleHeight = window.getComputedStyle(canvas.current).getPropertyValue('height').slice(0, -2);
    const styleWidth = window.getComputedStyle(canvas.current).getPropertyValue('width').slice(0, -2);
    canvas.current.setAttribute('height', styleHeight * dpi);
    canvas.current.setAttribute('width', styleWidth * dpi);
  };

  const generateBoids = (canvasWidth, canvasHeight) => {
    const boids = [];
    for (let n = 0; n < 15; n += 1) {
      boids.push({
        x: parseInt(Math.random() * canvasWidth, 10),
        y: parseInt(Math.random() * canvasHeight, 10),
      });
    }
    return boids;
  };

  const [boids, setBoids] = useState(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    fixDpi(window.devicePixelRatio);
    setBoids(generateBoids(canvas.current.width, canvas.current.height));
  }, []);

  useEffect(() => {
    let frame;
    const animate = () => {
      const ctx = canvas.current.getContext('2d');
      ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
      ctx.beginPath();
      ctx.fillStyle = 'lightblue';
      ctx.rect(0, 0, canvas.current.width, canvas.current.height);
      ctx.fill();
      boids.forEach((boid) => {
        // glow
        ctx.beginPath();
        ctx.arc(boid.x, boid.y, 5, 0, Math.PI * 2, false);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();

        // update positions of boids
      });
      frame = requestAnimationFrame(animate);
    };

    if (boids && !started) {
      setStarted(true);
      animate();
    }

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [boids]);

  return (
    <div>
      <canvas
        id="boid-canvas"
        ref={canvas}
        className="canvas"
      />
    </div>
  );
};

export default App;
