/* eslint-disable no-undef */
import React, { useRef, useEffect, useState } from 'react';
import { generateBoids, drawBoids, updateBoids } from '../simulate';

const App = () => {
  const canvas = useRef(null);
  const main = useRef(null);

  const fixDpi = (dpi) => {
    const styleHeight = window.getComputedStyle(main.current).getPropertyValue('height').slice(0, -2) / 2;
    const styleWidth = window.getComputedStyle(main.current).getPropertyValue('width').slice(0, -2) / 2;
    canvas.current.setAttribute('height', styleHeight * dpi);
    canvas.current.setAttribute('width', styleWidth * dpi);
  };

  const [initialBoids, setInitialBoids] = useState(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    fixDpi(window.devicePixelRatio);
    setInitialBoids(generateBoids(canvas.current.width, canvas.current.height));
  }, []);

  useEffect(() => {
    let frame;
    let boids = initialBoids;
    const animate = () => {
      drawBoids(canvas, boids);
      boids = updateBoids(boids);
      frame = requestAnimationFrame(animate);
    };

    if (boids && !started) {
      setStarted(true);
      animate();
    }

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [initialBoids]);

  return (
    <div id="main" ref={main}>
      <canvas
        id="boid-canvas"
        ref={canvas}
        className="canvas"
      />
    </div>
  );
};

export default App;
