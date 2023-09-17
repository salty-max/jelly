export type ColorArray = [number, number, number, number]

/**
 * @description Converts RGBA color to WebGL color
 * @param {ColorArray} color The RGBA color to convert
 * @returns {ColorArray} the WebGL color
 */
export function rgbToGl(color: ColorArray): ColorArray {
  return color.map((c) => (c > 0 ? c / 255 : 0)) as ColorArray
}

/**
 * @description Converts hexadecimal color to RGB color
 * @param {string} hex The hexadecimal color to convert
 * @returns {ColorArray} the RGB color
 */
export function hexToRgb(hex: string): ColorArray | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
    hex,
  )
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
        parseInt(result[4], 16),
      ]
    : null
}

/**
 * @description Converts hexadecimal color to RGB color
 * @param {string} hex The hexadecimal color to convert
 * @returns {ColorArray} the RGB color
 */
export function hextoGl(hex: string): ColorArray {
  const rgb = hexToRgb(hex)
  if (!rgb) {
    throw new Error(`Invalid hex color: ${hex}`)
  }

  return rgbToGl(rgb)
}
