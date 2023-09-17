import { GLUtil, gl } from '../gl/gl'
import { Shader } from '../gl/shader'

/**
 * The core engine class
 */
export class Engine {
  private _canvas!: HTMLCanvasElement
  private _shader!: Shader

  /**
   * Create a new engine
   */
  constructor() {}

  /**
   * Start up the engine
   */
  start() {
    this._canvas = GLUtil.init()

    gl.clearColor(0.0, 0.0, 0.0, 1.0)

    this.loadShaders()
    this._shader.use()

    this.loop()
  }

  /**
   * Resize the canvas to fit the window
   */
  resize() {
    this._canvas.setAttribute('width', `${window.innerWidth}`)
    this._canvas.setAttribute('height', `${window.innerHeight}`)
  }

  private loop() {
    gl.clear(gl.COLOR_BUFFER_BIT)
    requestAnimationFrame(this.loop.bind(this))
  }

  private loadShaders() {
    const vertexShaderSource = `
      attribute vec3 a_position;

      void main() {
        gl_Position = vec4(a_position, 1.0);
      }
    `

    const fragmentShaderSource = `
      precision mediump float;

      void main() {
        gl_FragColor = vec4(1.0);
      }
    `

    this._shader = new Shader('basic', vertexShaderSource, fragmentShaderSource)
  }
}
