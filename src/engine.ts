import { GLUtil, gl } from './gl'

/**
 * The core engine class
 */
class Engine {
  private _canvas?: HTMLCanvasElement

  /**
   * Create a new engine
   */
  constructor() {}

  /**
   * Start up the engine
   */
  start() {
    this._canvas = GLUtil.init()

    gl?.clearColor(0.0, 0.0, 0.0, 1.0)

    this.loop()
  }

  /**
   * Resize the canvas to fit the window
   */
  resize() {
    this._canvas?.setAttribute('width', `${window.innerWidth}`)
    this._canvas?.setAttribute('height', `${window.innerHeight}`)
  }

  private loop() {
    gl?.clear(gl.COLOR_BUFFER_BIT)
    requestAnimationFrame(this.loop.bind(this))
  }
}

export default Engine
