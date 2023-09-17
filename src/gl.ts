/**
 * The WebGL rendering context
 */
export let gl: WebGLRenderingContext | null = null

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

    gl = canvas.getContext('webgl')

    if (!gl) {
      throw new Error(
        'Unable to initialize WebGL. Your browser or machine may not support it.',
      )
    }

    return canvas
  }
}
