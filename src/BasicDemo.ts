import { mat4, vec3 } from 'gl-matrix';
import { createProgram, createContext, createRenderer, createBuffer, createElementBuffer, ShaderProgram, Buffer, Obj, ElementBuffer } from 'apl-easy-gl';

export interface Camera {
  pos: vec3;
  lookAt: vec3;
  up: vec3;
  near: number;
  far: number;
  fov: number;
}

export class BasicDemo {
  gl: WebGLRenderingContext;
  canvas: HTMLCanvasElement;
  shaders: Record<string, ShaderProgram>;
  buffers: Record<string, Record<string, Buffer | ElementBuffer>>;
  projectionMatrix: mat4;
  modelMatrix: mat4;
  viewMatrix: mat4;
  modelViewMatrix: mat4;
  modelViewProjMatrix: mat4;
  camera: Camera;

  rotateAmount: number = 0;
  dt: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.gl = createContext(canvas);
    this.projectionMatrix = mat4.create();
    this.modelMatrix = mat4.create();
    this.viewMatrix = mat4.create();
    this.modelViewMatrix = mat4.create();
    this.modelViewProjMatrix = mat4.create();
    this.camera = {
      pos: vec3.fromValues(0.0, 0.0, 6.0),
      lookAt: vec3.fromValues(0.0, 0.0, 0.0),
      up: vec3.fromValues(0.0, 1.0, 0.0),
      near: 0.01,
      far: 1000.0,
      fov: 45
    }

    this.createShaders();
    this.createBuffers();

    const renderer = createRenderer(() => {
      this.initScene();
      this.resizeScene();
    }, (dt) => {
      this.dt = dt;
      this.drawScene();
    });
    
    renderer.start(window);
  }

  createShaders() {
    this.shaders = {
      red: createProgram(this.gl, [
        'attribute vec3 aPosition;',

        'uniform mat4 modelViewProj;',

        'void main(void) {',
          'gl_Position = modelViewProj * vec4(aPosition, 1.0);',
        '}'
      ].join("\n"), [
        'precision mediump float;',

        'void main(void) {',
          'gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);',
        '}'
      ].join("\n"))
    };
  }
  
  createBuffers() {
    this.buffers = {
      triangle: {
        position: createBuffer(this.gl, new Float32Array([
          0.0,  1.0,  0.0,
          -1.0, -1.0,  0.0,
          1.0, -1.0,  0.0
        ]), 3),
        
        indices: createElementBuffer(this.gl, new Uint16Array([
          0, 1, 2
        ]), 1)
      }
    };
  }

  initScene() {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
  }

  resizeScene() {
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    mat4.perspective(this.projectionMatrix, this.camera.fov/180*Math.PI, this.canvas.width / this.canvas.height, this.camera.near, this.camera.far);
  }

  drawScene() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    
    //scene transforms
    this.rotateAmount -= (0.5 * this.dt) / 1000.0;
    
    mat4.identity(this.modelMatrix);
    mat4.rotate(this.modelMatrix, this.modelMatrix, this.rotateAmount, [1, 1, 1]);
    
    //camera transform
    mat4.identity(this.viewMatrix);
    mat4.lookAt(this.viewMatrix, this.camera.pos, this.camera.lookAt, this.camera.up);
    
    mat4.multiply(this.modelViewMatrix, this.viewMatrix, this.modelMatrix);
    mat4.multiply(this.modelViewProjMatrix, this.projectionMatrix, this.modelViewMatrix);
    
    //draw our triangle
    var shader = this.shaders.red;
    
    this.gl.useProgram(shader.program);

    shader.setUniforms({
      modelViewProj: this.modelViewProjMatrix
    });

    shader.setAttributes({
      aPosition: this.buffers.triangle.position
    });

    (this.buffers.triangle.indices as ElementBuffer).draw();
  }
}
