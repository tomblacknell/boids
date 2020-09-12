/* eslint-disable no-undef */
import * as React from 'react';
import { createRef } from 'react';
import { createBoids, drawBoids, updateBoids } from '../simulate';
import { Boid } from '../Boid';
import Rule from '../Rule';

interface AppState {
  initialBoids: Boid[],
  started: Boolean,
  controls: { [ruleEnbaled: string]: any }
};
interface AppProps { };

class App extends React.Component<AppProps, AppState> {

  constructor(props) {
    super(props);
    this.state = {
      initialBoids: [],
      started: false,
      controls: {
        rule1Enabled: true,
        rule2Enabled: true,
        rule3Enabled: true,
        rule4Enabled: true,
        rule5Enabled: true,
        numberOfBoids: 50,
      },
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
        initialBoids: createBoids(
          this.state.controls.numberOfBoids,
          this.canvas.current.width,
          this.canvas.current.height
        )
      }, () => {
        let boids: Boid[] = this.state.initialBoids;
        const animate = () => {
          drawBoids(this.canvas, boids);
          updateBoids(boids, this.canvas, this.state.controls);
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

  toggle(ruleName: string) {
    return (
      <div>
        <input
          type="checkbox"
          id={`${ruleName}-toggle`}
          name={`${ruleName}-toggle`}
          checked={this.state.controls[ruleName]}
          onClick={() => this.setState({
            controls: {
              ...this.state.controls,
              [ruleName]: !this.state.controls[ruleName]
            }
          })}
        />
      </div>
    )
  }

  slider(controlName: string, max: number, min: number) {
    return (
      <div className="slider">
        <p>{`${controlName}:`}</p>
        <p>{this.state.controls[controlName]}</p>
        <input
          type="range"
          min={min}
          max={max}
          value={this.state.controls[controlName]}
          onChange={event => {
            this.setState({
              controls: {
                ...this.state.controls,
                [controlName]: event.target.value,
              }
            })
          }}
        />
      </div>
    )
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
          <h2>BoidSim</h2>
          <p>Boids move according to several rules, configurable below.</p>
          <button onClick={() => {
            this.setState({ started: false, initialBoids: [] }, () => {
              this.start();
            })
          }}>Restart</button>
          {this.slider('numberOfBoids', 500, 1)}
          <div id="rule-1" className="rule">
            <h3>Rule 1: Cohesion</h3>
            {this.toggle('rule1Enabled')}
          </div>
          <div className="rule">
            <h3>Rule 2: Separation</h3>
            {this.toggle('rule2Enabled')}
          </div>
          <div className="rule">
            <h3>Rule 3: Alignment</h3>
            {this.toggle('rule3Enabled')}
          </div>
          <div className="rule">
            <h3>Rule 4: Bounds</h3>
            {this.toggle('rule4Enabled')}
          </div>
          <div className="rule">
            <h3>Rule 5: Velocity Limit</h3>
            {this.toggle('rule5Enabled')}
          </div>
        </div>
      </div>
    )
  }
}

export default App;
