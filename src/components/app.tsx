/* eslint-disable no-undef */
import * as React from 'react';
import { createRef, useEffect, useState } from 'react';
import { createBoids, drawBoids, updateBoids } from '../simulate';
import { Boid } from '../Boid';

const App = () => {
  const canvas: React.RefObject<HTMLCanvasElement> = createRef();
  const main: React.RefObject<HTMLDivElement> = createRef();

  const [initialBoids, initBoids] = useState<Boid[]>(new Array());
  const [started, setStarted] = useState(false);

  const fixDpi = (dpi: number) => {
    if (canvas.current && main.current) {
      const styleHeight: number = +window.getComputedStyle(main.current).getPropertyValue('height').slice(0, -2) / 2;
      const styleWidth: number = +window.getComputedStyle(main.current).getPropertyValue('width').slice(0, -2) / 2;
      canvas.current.setAttribute('height', String(styleHeight * dpi));
      canvas.current.setAttribute('width', String(styleWidth * dpi));
    }
  };

  useEffect(() => {
    fixDpi(window.devicePixelRatio);
    if (canvas.current) {
      initBoids(createBoids(20, canvas.current.width, canvas.current.height));
    }
  }, []);

  useEffect(() => {
    let frame;
    // let boids: Boid[] = initialBoids;
    const animate = () => {
      drawBoids(canvas, initialBoids);
      updateBoids(initialBoids);
      frame = requestAnimationFrame(animate);
    };

    if (initialBoids && !started) {
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
