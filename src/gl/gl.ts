/**
 * The WebGL rendering context
 */
export let gl: WebGLRenderingContext

/**
 * A utility class for WebGL
 */
export class GLUtil {
  /**
   * Initializes WebGL, potentially using an existing canvas if an element id is provided
   * @param elementId
   * @returns the canvas element
   */
  public static init(elementId?: string): HTMLCanvasElement {
    let canvas: HTMLCanvasElement

    if (elementId) {
      canvas = document.getElementById(elementId) as HTMLCanvasElement
      if (!canvas) {
        throw new Error(`Cannot find canvas with id ${elementId}`)
      }
    } else {
      canvas = document.createElement('canvas') as HTMLCanvasElement
      document.body.appendChild(canvas)
    }

    const ctx = canvas.getContext('webgl')

    if (!ctx) {
      throw new Error(
        'Unable to initialize WebGL. Your browser or machine may not support it.',
      )
    }

    gl = ctx as WebGLRenderingContext

    return canvas
  }
}
