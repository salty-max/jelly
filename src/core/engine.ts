import { GLUtil, gl } from '../gl/gl'
import { AttributeInfo, GLBuffer } from '../gl/gl-buffer'
import { Shader } from '../gl/shader'
import { hextoGl } from '../util/util'

/**
 * The core engine class
 */
export class Engine {
  private _canvas!: HTMLCanvasElement
  private _shader!: Shader
  private _buffer!: GLBuffer

  /**
   * Create a new engine
   */
  constructor() {}

  /**
   * Start up the engine
   */
  start() {
    this._canvas = GLUtil.init()

    gl.clearColor(...hextoGl('#1D2B53FF'))

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

    // Set uniforms
    const colorPosition = this._shader.getUniformLocation('u_color')
    gl.uniform4fv(colorPosition, hextoGl('#29ADFFFF'))

    this._buffer.bind()
    this._buffer.draw()

    requestAnimationFrame(this.loop.bind(this))
  }

  private createBuffer() {
    const positionAttrib = new AttributeInfo(
      this._shader.getAttribLocation('a_position'),
      3,
      0,
    )

    // prettier-ignore
    const vertices: number[] = [
      // x, y, z
      0, 0, 0,
      0, 0.5, 0,
      0.5, 0.5, 0,
    ]

    this._buffer = new GLBuffer(3)
    this._buffer.addAttributeLocation(positionAttrib)
    this._buffer.pushBackData(vertices)
    this._buffer.upload()
    this._buffer.unbind()
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

      uniform vec4 u_color;

      void main() {
        gl_FragColor = u_color;
      }
    `

    this._shader = new Shader('basic', vertexShaderSource, fragmentShaderSource)
  }
}
