import * as React from 'react';

const Canvas = ({
  canvasRef,
}) => {
  console.log('rendering canvas')
  return (
    <canvas
      id="boid-canvas"
      ref={canvasRef}
      className="canvas"
    />
  );
};

export default React.memo(Canvas);