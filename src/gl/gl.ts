/**
 * Represents the WebGL rendering context.
 */
export let gl: WebGLRenderingContext

/**
 * Provides utility functions for initializing and managing WebGL contexts.
 * @class
 */
export class GLUtil {
  /**
   * Initializes the WebGL rendering context. If a canvas element ID is provided, it attempts to use that canvas.
   * Otherwise, it creates a new canvas element and appends it to the document body.
   *
   * @param elementId - Optional ID of an existing canvas element to use. If not provided, a new canvas will be created.
   * @returns The canvas element that the WebGL context is bound to.
   *
   * @throws {Error} Throws an error if a canvas with the provided ID cannot be found or if WebGL initialization fails.
   */
  public static init(elementId?: string): HTMLCanvasElement {
    let canvas: HTMLCanvasElement

    // If an element ID is provided, attempt to retrieve the corresponding canvas element.
    if (elementId) {
      canvas = document.getElementById(elementId) as HTMLCanvasElement
      if (!canvas) {
        throw new Error(
          `Cannot find a canvas element with the ID "${elementId}"`,
        )
      }
    } else {
      // Otherwise, create a new canvas element and append it to the document body.
      canvas = document.createElement('canvas') as HTMLCanvasElement
      document.body.appendChild(canvas)
    }

    // Attempt to get the WebGL rendering context from the canvas.
    const ctx = canvas.getContext('webgl')

    if (!ctx) {
      throw new Error(
        'Unable to initialize WebGL. It is possible that your browser or machine does not support it.',
      )
    }

    gl = ctx as WebGLRenderingContext

    return canvas
  }
}
