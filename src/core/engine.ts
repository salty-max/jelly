import { GLUtil, gl } from '../gl/gl'
import { Shader } from '../gl/shader'
import { Sprite } from '../graphics/sprite'
import { hextoGl } from '../util/util'
import { Mat4 } from './math/mat4'

/**
 * The core engine class
 */
export class Engine {
  private _canvas!: HTMLCanvasElement
  private _shader!: Shader
  private _projection!: Mat4

  private _sprite!: Sprite

  /**
   * Create a new engine
   */
  constructor() {}

  /**
   * Start up the engine
   */
  start() {
    this._canvas = GLUtil.init()
    this._canvas.width = 512
    this._canvas.height = 512

    gl.clearColor(...hextoGl('#1D2B53FF'))

    this.loadShaders()
    this._shader.use()

    // Load
    this._sprite = new Sprite('test', 200, 200)
    this._sprite.load()

    this.resize()
    this.loop()
  }

  /**
   * Resize the canvas to fit the window
   */
  resize() {
    this._canvas.width =
      this._canvas.width > window.innerWidth
        ? window.innerWidth
        : this._canvas.width
    this._canvas.height =
      this._canvas.height > window.innerHeight
        ? window.innerHeight
        : this._canvas.height

    this._projection = Mat4.orthographic(
      0,
      this._canvas.width,
      0,
      this._canvas.height,
      -100,
      100,
    )

    gl.viewport(0, 0, this._canvas.width, this._canvas.height)
  }

  private loop() {
    gl.clear(gl.COLOR_BUFFER_BIT)

    // Set uniforms
    const colorLocation = this._shader.getUniformLocation('u_color')
    gl.uniform4fv(colorLocation, hextoGl('#29ADFFFF'))

    const projLocation = this._shader.getUniformLocation('u_projection')
    gl.uniformMatrix4fv(projLocation, false, this._projection.data)

    const modelLocation = this._shader.getUniformLocation('u_model')
    gl.uniformMatrix4fv(
      modelLocation,
      false,
      new Float32Array(Mat4.translation(this._sprite.position).data),
    )

    this._sprite.draw()

    requestAnimationFrame(this.loop.bind(this))
  }

  private loadShaders() {
    const vertexShaderSource = `
      attribute vec3 a_position;
      uniform mat4 u_projection;
      uniform mat4 u_model;

      void main() {
        gl_Position = u_projection * u_model * vec4(a_position, 1.0);
      }
    `

    const fragmentShaderSource = `
      precision mediump float;

      uniform vec4 u_color;

      void main() {
        gl_FragColor = u_color;
      }
    `

    this._shader = new Shader('basic', vertexShaderSource, fragmentShaderSource)
  }
}
