/* eslint-disable no-undef */
import * as React from 'react';
import { createRef } from 'react';
import { createBoids, drawBoids, updateBoids } from '../simulate';
import { Boid } from '../Boid';

interface AppState { initialBoids: Boid[], started: Boolean, rule1: boolean };
interface AppProps { };

class App extends React.Component<AppProps, AppState> {

  constructor(props) {
    super(props);
    this.state = {
      initialBoids: [],
      started: false,
      rule1: true,
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
        let boids: Boid[] = this.state.initialBoids;
        const animate = () => {
          drawBoids(this.canvas, boids);
          updateBoids(boids, this.canvas);
          requestAnimationFrame(animate);
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

          <div id="rule-1" className="rule">
            <h3>Rule 1: Cohesion</h3>
            <input 
              type="checkbox"
              id="rule-1-toggle"
              name="rule-1-toggle"
              value="Enabled"
              checked={this.state.rule1}
              onClick={() => this.setState({ rule1: !this.state.rule1 })}
            />
            {/* <input type="range" min="1" max="100" /> */}
          </div>
          <div className="rule">
            <h3>Rule 2: Separation</h3>
            <input type="checkbox" id="rule-2-toggle" name="rule-2-toggle" value="Enabled" checked />
          </div>
          <div className="rule">
            <h3>Rule 3: Alignment</h3>
            <input type="checkbox" id="rule-3-toggle" name="rule-3-toggle" value="Enabled" checked />
          </div>
          <div className="rule">
            <h3>Rule 4: Velocity Limit</h3>
            <input type="checkbox" id="rule-4-toggle" name="rule-4-toggle" value="Enabled" checked />
          </div>
          <div className="rule">
            <h3>Rule 5: Bounds</h3>
            <input type="checkbox" id="rule-5-toggle" name="rule-5-toggle" value="Enabled" checked />
          </div>
        </div>
      </div>
    )
  }

}

export default App;
