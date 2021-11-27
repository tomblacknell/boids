/* eslint-disable no-undef */
import * as React from 'react';
import { createRef } from 'react';
import { createBoids, updateBoids } from '../simulate';
import { Boid } from '../Boid';
import { TransformationMatrix } from '../TransformationMatrix';
import Canvas from './canvas';

interface AppState {
  initialBoids: Boid[],
  started: Boolean,
  controls: {
    [ruleEnbaled: string]: any,
    currentScale: number,
    translateX: number,
    translateY: number,
  },
};
interface AppProps { };

let gl;
let glCanvas;

// Vertex information

let boidArray;
let boidBuffer;
let boxBuffer;
let boxArray;
let vertexNumComponents;
let vertexCount;

// Rendering data shared with the scalers.

let uFudgeFactor;
let uGlobalColor;
let aVertexPosition;
let uTransformationMatrix;

let boidShaderProgram;
let boxShaderProgram;

const boxVertexShader = `
attribute vec4 aVertexPosition;
uniform mat4 uTransformationMatrix;
uniform float uFudgeFactor;

void main() {
  vec4 position = uTransformationMatrix * aVertexPosition;
  float zToDivideBy = 1.0 + position.z * uFudgeFactor;

  gl_Position = vec4(position.xy / zToDivideBy, position.zw);
}
`;

const boxFragmentShader = `
#ifdef GL_ES
  precision highp float;
#endif

uniform vec4 uGlobalColor;

void main() {
  gl_FragColor = uGlobalColor;
}
`;

const boidVertexShader = `
attribute vec4 aVertexPosition;
uniform mat4 uTransformationMatrix;
uniform float uFudgeFactor;

void main() {
  vec4 position = uTransformationMatrix * aVertexPosition;
  float zToDivideBy = 1.0 + position.z * uFudgeFactor;

  gl_Position = vec4(position.xy / zToDivideBy, position.zw);
  gl_PointSize = 10.0;
}
`;

const boidFragmentShader = `
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
        currentScale: 55,
        translateX: 900,
        translateY: 500,
        translateZ: 0,
        xRotate: 21,
        yRotate: 15,
        zRotate: 0,
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

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // draw the box
    boxArray = Float32Array.from([
      // h, w, d
      0, 0, 0,
      gl.canvas.width, 0, 0,

      0, 0, 0,
      0, gl.canvas.height, 0,

      0, 0, 0,
      0, 0, 1000,

      gl.canvas.width, 0, 0,
      gl.canvas.width, gl.canvas.height, 0,

      0, gl.canvas.height, 0,
      gl.canvas.width, gl.canvas.height, 0,

      gl.canvas.width, 0, 0,
      gl.canvas.width, 0, 1000,

      0, 0, 1000,
      gl.canvas.width, 0, 1000,

      gl.canvas.width, 0, 1000,
      gl.canvas.width, gl.canvas.height, 1000,

      0, gl.canvas.height, 0,
      0, gl.canvas.height, 1000,

      0, 0, 1000,
      0, gl.canvas.height, 1000,

      gl.canvas.width, gl.canvas.height, 0,
      gl.canvas.width, gl.canvas.height, 1000,

      0, gl.canvas.height, 1000,
      gl.canvas.width, gl.canvas.height, 1000,
    ]);
    gl.bindBuffer(gl.ARRAY_BUFFER, boxBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, boxArray, gl.STATIC_DRAW);

    gl.useProgram(boxShaderProgram);

    uGlobalColor = gl.getUniformLocation(boxShaderProgram, "uGlobalColor");
    uTransformationMatrix = gl.getUniformLocation(boxShaderProgram, "uTransformationMatrix")
    uFudgeFactor = gl.getUniformLocation(boxShaderProgram, "uFudgeFactor");

    gl.uniform1f(uFudgeFactor, 1);
    gl.uniform4fv(uGlobalColor, [0.0960, 0.150, 0.640, .8]);

    var left = 0;
    var right = gl.canvas.width;
    var top = 0;
    var bottom = gl.canvas.height;
    var near = 3000;
    var far = -3000;
    var projectionMatrix = new TransformationMatrix()
      .project(left, right, bottom, top, near, far);

    var transformMatrix = new TransformationMatrix()
      .multiply(projectionMatrix)
      .translate(this.state.controls.translateX, this.state.controls.translateY, this.state.controls.translateZ) // add z translate
      .xRotate(this.state.controls.xRotate * (Math.PI / 180))
      .yRotate(this.state.controls.yRotate * (Math.PI / 180))
      .zRotate(this.state.controls.zRotate * (Math.PI / 180))
      .scale(this.state.controls.currentScale / 100, this.state.controls.currentScale / 100, this.state.controls.currentScale / 100)

    gl.uniformMatrix4fv(uTransformationMatrix, false, transformMatrix.getValues());

    aVertexPosition = gl.getAttribLocation(boxShaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(aVertexPosition);
    gl.vertexAttribPointer(aVertexPosition, vertexNumComponents, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.LINES, 0, 24);

    //draw boids
    const vertexNumArray: number[] = [];
    boids.forEach(boid => {
      vertexNumArray.push(boid.getPos().getX());
      vertexNumArray.push(boid.getPos().getY());
      vertexNumArray.push(boid.getPos().getZ());
    });
    boidArray = Float32Array.from(vertexNumArray);
    gl.bindBuffer(gl.ARRAY_BUFFER, boidBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, boidArray, gl.STATIC_DRAW);

    gl.useProgram(boidShaderProgram);

    uGlobalColor = gl.getUniformLocation(boidShaderProgram, "uGlobalColor");
    uTransformationMatrix = gl.getUniformLocation(boidShaderProgram, "uTransformationMatrix")
    uFudgeFactor = gl.getUniformLocation(boidShaderProgram, "uFudgeFactor");

    gl.uniform4fv(uGlobalColor, [1.0, 1.0, 1.0, 1.0]);
    gl.uniformMatrix4fv(uTransformationMatrix, false, transformMatrix.getValues());
    gl.uniform1f(uFudgeFactor, 1);

    aVertexPosition = gl.getAttribLocation(boidShaderProgram, "aVertexPosition");

    gl.enableVertexAttribArray(aVertexPosition);
    gl.vertexAttribPointer(aVertexPosition, vertexNumComponents, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.POINTS, 0, vertexCount);
  };

  start() {
    glCanvas = this.canvas.current;
    if (glCanvas) {
      gl = glCanvas.getContext('webgl');

      const boidShaderSet = [
        {
          type: gl.VERTEX_SHADER,
          code: boidVertexShader,
        },
        {
          type: gl.FRAGMENT_SHADER,
          code: boidFragmentShader,
        },
      ];

      const boxShaderSet = [
        {
          type: gl.VERTEX_SHADER,
          code: boxVertexShader,
        },
        {
          type: gl.FRAGMENT_SHADER,
          code: boxFragmentShader,
        },
      ];

      boidShaderProgram = this.buildShaderProgram(boidShaderSet);
      boxShaderProgram = this.buildShaderProgram(boxShaderSet);

      const intialPositions: Boid[] = createBoids(
        this.state.controls.numberOfBoids,
        glCanvas.width,
        glCanvas.height,
        1000
      );

      const vertexNumArray: number[] = [];
      intialPositions.forEach(boid => {
        vertexNumArray.push(boid.getPos().getX());
        vertexNumArray.push(boid.getPos().getY());
        vertexNumArray.push(boid.getPos().getZ());
      });

      boidArray = Float32Array.from(vertexNumArray);
      boidBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, boidBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, boidArray, gl.STATIC_DRAW);

      boxBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, boxBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, boxArray, gl.STATIC_DRAW);

      vertexNumComponents = 3;
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
        <p>{`${controlLabel}: ${this.state.controls[controlName]}`}</p>
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
    console.log('rendering');
    return (
      <div className="panels">
        <div id="main" ref={this.main}>
          <Canvas canvasRef={this.canvas} />
        </div>
        <div className="controls">
          <h2>BoidSim</h2>
          <button onClick={() => {
            this.setState({ started: false, initialBoids: [] }, () => {
              this.start();
            })
          }}>Restart</button>
          {this.slider('Number', 'numberOfBoids', 500, 1)}
          {this.slider('Scale', 'currentScale', 100, 0)}
          {this.slider('Translate X', 'translateX', 2000, -2000)}
          {this.slider('Translate Y', 'translateY', 2000, -2000)}
          {this.slider('Translate Z', 'translateZ', 2000, -2000)}
          {this.slider('Rotate X', 'xRotate', 360, 0)}
          {this.slider('Rotate Y', 'yRotate', 360, 0)}
          {this.slider('Rotate Z', 'zRotate', 360, 0)}
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
