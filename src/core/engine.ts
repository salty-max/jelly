import { GLUtil, gl } from '../gl/gl'
import { Material } from '../graphics/material'
import { MaterialManager } from '../graphics/material-manager'
import { BasicShader } from '../shaders/basic-shader'
import { hextoGl } from '../util/util'
import { Mat4 } from './math/mat4'
import { MessageBus } from './message/message-bus'
import { ResourceManager } from './resource/resource-manager'
import { ZoneManager } from './world/zone-manager'

/**
 * The core engine class
 */
export class Engine {
  private _canvas!: HTMLCanvasElement
  private _basicShader!: BasicShader
  private _projection!: Mat4

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

    // Load materials
    MaterialManager.registerMaterial(
      new Material('firefox', '../../resources/textures/firefox.gif'),
    )

    const zoneId = ZoneManager.createTestZone()
    ZoneManager.changeZone(zoneId)

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

    ZoneManager.update(0)

    gl.clear(gl.COLOR_BUFFER_BIT)

    // Set projection plane
    const projLocation = this._basicShader.getUniformLocation('u_projection')
    gl.uniformMatrix4fv(projLocation, false, this._projection.data)

    ZoneManager.draw(this._basicShader)

    requestAnimationFrame(this.loop.bind(this))
  }
}
