import { GLUtil, gl } from '../gl/gl'
import { Shader } from '../gl/shader'
import { Sprite } from '../graphics/sprite'
import { hextoGl } from '../util/util'
import { Mat4 } from './math/mat4'
import { MessageBus } from './message/message-bus'
import { ResourceManager } from './resource/resource-manager'

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

    gl.clearColor(...hextoGl('#1D2B53FF'))

    ResourceManager.init()

    this.loadShaders()
    this._shader.use()

    // Load
    this._sprite = new Sprite('test', '../../resources/textures/firefox.gif')
    this._sprite.load()

    this.resize()
    this.loop()
  }

  /**
   * Resize the canvas to fit the window
   */
  resize() {
    this._canvas.width = window.innerWidth
    this._canvas.height = window.innerHeight

    gl.viewport(0, 0, this._canvas.width, this._canvas.height)

    this._projection = Mat4.orthographic(
      0,
      this._canvas.width,
      this._canvas.height,
      0,
      -100,
      100,
    )
  }

  private loop() {
    MessageBus.update()
    gl.clear(gl.COLOR_BUFFER_BIT)

    // Set uniforms
    const tintLocation = this._shader.getUniformLocation('u_tint')
    gl.uniform4fv(tintLocation, hextoGl('#FFFFFFFF'))

    const projLocation = this._shader.getUniformLocation('u_projection')
    gl.uniformMatrix4fv(projLocation, false, this._projection.data)

    const modelLocation = this._shader.getUniformLocation('u_model')
    gl.uniformMatrix4fv(
      modelLocation,
      false,
      new Float32Array(Mat4.translation(this._sprite.position).data),
    )

    this._sprite.draw(this._shader)

    requestAnimationFrame(this.loop.bind(this))
  }

  private loadShaders() {
    const vertexShaderSource = `
      attribute vec3 a_position;
      attribute vec2 a_texCoord;

      uniform mat4 u_projection;
      uniform mat4 u_model;

      varying vec2 v_texCoord;

      void main() {
        gl_Position = u_projection * u_model * vec4(a_position, 1.0);
        v_texCoord = a_texCoord;
      }
    `

    const fragmentShaderSource = `
      precision mediump float;

      uniform vec4 u_tint;
      uniform sampler2D u_diffuse;

      varying vec2 v_texCoord;

      void main() {
        gl_FragColor = u_tint * texture2D(u_diffuse, v_texCoord);
      }
    `

    this._shader = new Shader('basic', vertexShaderSource, fragmentShaderSource)
  }
}
