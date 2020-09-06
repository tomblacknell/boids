/* eslint-disable no-undef */
import * as React from 'react';
import { createRef } from 'react';
import { createBoids, drawBoids, updateBoids } from '../simulate';
import { Boid } from '../Boid';
import Rule from '../Rule';

interface AppState {
  initialBoids: Boid[],
  started: Boolean,
  controls: { [rule: string]: Rule }
};
interface AppProps { };

class App extends React.Component<AppProps, AppState> {

  constructor(props) {
    super(props);
    this.state = {
      initialBoids: [],
      started: false,
      controls: {
        rule1: {
          enabled: true,
        },
        rule2: {
          enabled: true,
        },
        rule3: {
          enabled: true,
        },
        rule4: {
          enabled: true,
        },
        rule5: {
          enabled: true,
        },
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
        initialBoids: createBoids(50, this.canvas.current.width, this.canvas.current.height)
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

  createRuleToggle(ruleName: string) {
    return (
      <input
        type="checkbox"
        id={`${ruleName}-toggle`}
        name={`${ruleName}-toggle`}
        checked={this.state.controls[ruleName].enabled}
        onClick={() => this.setState({
          controls: {
            ...this.state.controls,
            [ruleName]: {
              enabled: !this.state.controls[ruleName].enabled
            }
          }
        })}
      />)
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
          <div id="rule-1" className="rule">
            <h3>Rule 1: Cohesion</h3>
            {this.createRuleToggle('rule1')}
          </div>
          <div className="rule">
            <h3>Rule 2: Separation</h3>
            {this.createRuleToggle('rule2')}
          </div>
          <div className="rule">
            <h3>Rule 3: Alignment</h3>
            {this.createRuleToggle('rule3')}
          </div>
          <div className="rule">
            <h3>Rule 4: Bounds</h3>
            {this.createRuleToggle('rule4')}
          </div>
          <div className="rule">
            <h3>Rule 5: Velocity Limit</h3>
            {this.createRuleToggle('rule5')}
          </div>
        </div>
      </div>
    )
  }
}

export default App;
