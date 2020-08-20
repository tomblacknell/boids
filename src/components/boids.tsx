/* eslint-disable no-undef */
import * as React from 'react';
import { createRef } from 'react';
import { createBoids, drawBoids, updateBoids } from '../simulate';
import { Boid } from '../Boid';

interface AppState { initialBoids: Boid[], started: Boolean };
interface AppProps { };

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
    if (this.canvas.current && this.main.current) {
      const styleHeight: number = +window.getComputedStyle(this.main.current).getPropertyValue('height').slice(0, -2);
      const styleWidth: number = +window.getComputedStyle(this.main.current).getPropertyValue('width').slice(0, -2);
      this.canvas.current.setAttribute('height', String(styleHeight * dpi));
      this.canvas.current.setAttribute('width', String(styleWidth * dpi));
    }
  };

  start() {
    if (this.canvas.current) {
      this.setState({
        ...this.state,
        initialBoids: createBoids(50, this.canvas.current.width, this.canvas.current.height)
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
      });
    }
  }

  componentDidMount() {
    this.fixDpi(window.devicePixelRatio);
    this.start();
  }

  render() {
    return (
      <div className="panels">
        <div id="main" ref={this.main}>
          <canvas
            id="boid-canvas"
            ref={this.canvas}
            className="canvas"
          />
        </div>
        <div className="controls">
          <h2>boid_sim</h2>
          <p>Boids move according to several rules, configurable below.</p>
          <button onClick={() => {
            this.setState({ started: false, initialBoids: [] }, () => {
              this.start();
            })
          }}>Restart</button>

          <div className="rule">
            <h3>Rule 1: Cohesion</h3>
            {/* <input type="range" min="1" max="100" /> */}
          </div>
          <div className="rule">
            <h3>Rule 2: Separation</h3>
          </div>
          <div className="rule">
            <h3>Rule 3: Alignment</h3>
          </div>
          <div className="rule">
            <h3>Rule 4: Velocity Limit</h3>
          </div>
          <div className="rule">
            <h3>Rule 5: Bounds</h3>
          </div>
        </div>
      </div>
    )
  }

}

export default App;
