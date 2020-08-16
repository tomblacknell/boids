/* eslint-disable no-undef */
import * as React from 'react';
import { createRef } from 'react';
import { createBoids, drawBoids, updateBoids } from '../simulate';
import { Boid } from '../Boid';

interface AppState { initialBoids: Boid[], started: Boolean };
interface AppProps {};

class App extends React.Component<AppProps, AppState> {

  constructor(props) {
    super(props);
    this.state = {
      initialBoids: [],
      started: false,
    }
  }

  private canvas: React.RefObject<HTMLCanvasElement> = createRef();
  private main: React.RefObject<HTMLDivElement> = createRef();

  fixDpi(dpi: number) {
    console.log('wanna fix')
    if (this.canvas.current && this.main.current) {
      console.log('fixing dpi!')
      const styleHeight: number = +window.getComputedStyle(this.main.current).getPropertyValue('height').slice(0, -2);
      const styleWidth: number = +window.getComputedStyle(this.main.current).getPropertyValue('width').slice(0, -2);
      this.canvas.current.setAttribute('height', String(styleHeight * dpi));
      this.canvas.current.setAttribute('width', String(styleWidth * dpi));
    }
  };

  componentDidMount() {
    if (this.canvas.current) {
      this.fixDpi(window.devicePixelRatio);
      this.setState({
        ...this.state,
        initialBoids: createBoids(100, this.canvas.current.width, this.canvas.current.height)
      }, () => {
        let frame;
        let boids: Boid[] = this.state.initialBoids;
        const animate = () => {
          drawBoids(this.canvas, boids);
          updateBoids(boids, this.canvas);
          frame = requestAnimationFrame(animate);
        };
        if (boids && !this.state.started) {
          this.setState({ ...this.state, started: true });
          animate();
        }
        return () => {
          cancelAnimationFrame(frame);
        };
      });
    }
  }

  render() {
    return (
      <div id="main" ref={this.main}>
        <canvas
          id="boid-canvas"
          ref={this.canvas}
          className="canvas"
        />
      </div>
    )
  }

}

export default App;
