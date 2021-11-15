/* eslint-disable no-undef */
import * as React from 'react';
import { createRef } from 'react';
import { createBoids, updateBoids } from '../simulate';
import { Boid } from '../Boid';
import Rule from '../Rule';

interface AppState {
  initialBoids: Boid[],
  started: Boolean,
  controls: { [ruleEnbaled: string]: any }
};
interface AppProps { };

let gl;
let glCanvas;

// Aspect ratio and coordinate system
// details

let aspectRatio;
let currentRotation = [0, 1];
let currentScale = [1.0, 1.0];

// Vertex information

let boidArray;
let boidBuffer;
let vertexNumComponents;
let vertexCount;

// Rendering data shared with the scalers.

let uScalingFactor;
let uGlobalColor;
let aVertexPosition;

let shaderProgram;

const vertexShader = `
attribute vec2 aVertexPosition;

uniform vec2 uScalingFactor;

void main() {
  // convert the position from pixels to 0.0 to 1.0
  vec2 zeroToOne = aVertexPosition / uScalingFactor;

  // convert from 0->1 to 0->2
  vec2 zeroToTwo = zeroToOne * 2.0;

  // convert from 0->2 to -1->+1 (clip space)
  vec2 clipSpace = zeroToTwo - 1.0;

  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1.0);
  gl_PointSize = 10.0;
}
`;

const fragmentShader = `
#ifdef GL_ES
  precision highp float;
#endif

uniform vec4 uGlobalColor;

void main() {
  gl_FragColor = uGlobalColor;
}
`;

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

  compileShader(type, code) {
    let shader = gl.createShader(type);

    gl.shaderSource(shader, code);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.log(`Error compiling ${type === gl.VERTEX_SHADER ? "vertex" : "fragment"} shader:`);
      console.log(gl.getShaderInfoLog(shader));
    }
    return shader;
  }

  buildShaderProgram(shaderSet) {
    let program = gl.createProgram();

    shaderSet.forEach(shader => {
      console.log(shader)
      let compiledShader = this.compileShader(shader.type, shader.code);

      if (compiledShader) {
        gl.attachShader(program, compiledShader);
      }
    });

    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.log("Error linking shader program:");
      console.log(gl.getProgramInfoLog(program));
    }

    return program;
  }

  draw(boids) {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    const vertexNumArray: number[] = [];
    boids.forEach(boid => {
      vertexNumArray.push(boid.getPos().getX());
      vertexNumArray.push(boid.getPos().getY());
    });
    boidArray = Float32Array.from(vertexNumArray);
    gl.bindBuffer(gl.ARRAY_BUFFER, boidBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, boidArray, gl.STATIC_DRAW);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(shaderProgram);

    uScalingFactor =
      gl.getUniformLocation(shaderProgram, "uScalingFactor");
    uGlobalColor =
      gl.getUniformLocation(shaderProgram, "uGlobalColor");

    gl.uniform4fv(uGlobalColor, [1.0, 1.0, 1.0, 1.0]);
    gl.uniform2f(uScalingFactor, gl.canvas.width, gl.canvas.height);

    gl.bindBuffer(gl.ARRAY_BUFFER, boidBuffer);

    aVertexPosition =
      gl.getAttribLocation(shaderProgram, "aVertexPosition");

    gl.enableVertexAttribArray(aVertexPosition);
    gl.vertexAttribPointer(aVertexPosition, vertexNumComponents, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.POINTS, 0, vertexCount);
  };

  start() {
    glCanvas = this.canvas.current;
    if (glCanvas) {
      gl = glCanvas.getContext('webgl');

      const shaderSet = [
        {
          type: gl.VERTEX_SHADER,
          code: vertexShader,
        },
        {
          type: gl.FRAGMENT_SHADER,
          code: fragmentShader,
        },
      ];

      shaderProgram = this.buildShaderProgram(shaderSet);

      aspectRatio = glCanvas.width / glCanvas.height;
      currentScale = [1.0, aspectRatio];

      const intialPositions: Boid[] = createBoids(
        this.state.controls.numberOfBoids,
        glCanvas.width,
        glCanvas.height
      );

      const vertexNumArray: number[] = [];
      intialPositions.forEach(boid => {
        vertexNumArray.push(boid.getPos().getX());
        vertexNumArray.push(boid.getPos().getY());
      });

      boidArray = Float32Array.from(vertexNumArray);
      boidBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, boidBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, boidArray, gl.STATIC_DRAW);

      vertexNumComponents = 2;
      vertexCount = boidArray.length / vertexNumComponents;

      this.setState({
        ...this.state,
        initialBoids: intialPositions,
      }, () => {
        let boids: Boid[] = this.state.initialBoids;
        const animate = () => {
          this.draw(boids);
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

  slider(controlLabel: string, controlName: string, max: number, min: number) {
    return (
      <div className="slider">
        <p>{`${controlLabel}:`}</p>
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
          <button onClick={() => {
            this.setState({ started: false, initialBoids: [] }, () => {
              this.start();
            })
          }}>Restart</button>
          {this.slider('Number', 'numberOfBoids', 500, 1)}
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
