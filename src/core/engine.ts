import { GLUtil, gl } from '../gl/gl'
import { Sprite } from '../graphics/sprite'
import { BasicShader } from '../shaders/basic-shader'
import { hextoGl } from '../util/util'
import { Mat4 } from './math/mat4'
import { MessageBus } from './message/message-bus'
import { ResourceManager } from './resource/resource-manager'

/**
 * The core engine class
 */
export class Engine {
  private _canvas!: HTMLCanvasElement
  private _basicShader!: BasicShader
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

    this._basicShader = new BasicShader()
    this._basicShader.use()

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

    // Set projection plane
    const projLocation = this._basicShader.getUniformLocation('u_projection')
    gl.uniformMatrix4fv(projLocation, false, this._projection.data)

    this._sprite.draw(this._basicShader)

    requestAnimationFrame(this.loop.bind(this))
  }
}
