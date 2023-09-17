import { GLUtil, gl } from '../gl/gl'
import { Shader } from '../gl/shader'

/**
 * The core engine class
 */
export class Engine {
  private _canvas!: HTMLCanvasElement
  private _shader!: Shader
  private _buffer!: WebGLBuffer

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

    this.createBuffer()
    this.resize()
    this.loop()
  }

  /**
   * Resize the canvas to fit the window
   */
  resize() {
    this._canvas.setAttribute('width', `${window.innerWidth}`)
    this._canvas.setAttribute('height', `${window.innerHeight}`)

    gl.viewport(0, 0, this._canvas.width, this._canvas.height)
  }

  private loop() {
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer)
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(0)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
    gl.disableVertexAttribArray(0)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)

    requestAnimationFrame(this.loop.bind(this))
  }

  private createBuffer() {
    const buf = gl.createBuffer()
    if (!buf) {
      throw new Error('Error creating buffer')
    }
    this._buffer = buf

    // prettier-ignore
    const vertices: number[] = [
      // x, y, z
      0, 0, 0,
      0, 0.5, 0,
      0.5, 0.5, 0,
    ]

    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer)
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(0)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    gl.disableVertexAttribArray(0)
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
