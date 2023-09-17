import { Vec3 } from './vec3'

/**
 * Encapsulates a 4x4 matrix primarily designed for 3D transformations.
 *
 * This class offers a collection of methods for typical matrix operations,
 * including identity generation, orthographic projections and translation matrices.
 * @class
 */
export class Mat4 {
  private _data: number[] = []

  /**
   * Constructs an identity matrix.
   *
   * The default constructor initializes the matrix data as an identity matrix,
   * which leaves a vector unchanged when multiplied.
   * @private
   */
  private constructor() {
    // prettier-ignore
    this._data = [
      1, 0, 0, 0, // Column 1
      0, 1, 0, 0, // Column 2
      0, 0, 1, 0, // Column 3
      0, 0, 0, 1, // Column 4
    ];
  }

  /**
   * Retrieves the internal data representation of the matrix.
   * @returns {number[]} - The matrix's flattened array.
   */
  get data(): number[] {
    return this._data
  }

  /**
   * Constructs and returns an identity matrix.
   *
   * The identity matrix possesses the property where its diagonal values are set to 1,
   * leaving any vector unaltered when multiplied by this matrix.
   *
   * @static
   * @returns {Mat4} - A new identity matrix.
   */
  static identity(): Mat4 {
    return new Mat4()
  }

  /**
   * Constructs an orthographic projection matrix based on the specified clipping planes.
   *
   * An orthographic projection creates a box-shaped frustum. Everything inside this box
   * is rendered in a type of projection that does not make things appear larger or smaller
   * as they come closer or move farther away.
   *
   * @static
   * @param {number} left - Coordinate for the left clipping plane.
   * @param {number} right - Coordinate for the right clipping plane.
   * @param {number} bottom - Coordinate for the bottom clipping plane.
   * @param {number} top - Coordinate for the top clipping plane.
   * @param {number} nearClip - Distance to the near clipping plane.
   * @param {number} farClip - Distance to the far clipping plane.
   * @returns {Mat4} - The constructed orthographic projection matrix.
   */
  static orthographic(
    left: number,
    right: number,
    bottom: number,
    top: number,
    nearClip: number,
    farClip: number,
  ): Mat4 {
    const mat = new Mat4()
    const lr = 1 / (left - right)
    const bt = 1 / (bottom - top)
    const nf = 1 / (nearClip - farClip)

    // prettier-ignore
    mat._data = [
      -2 * lr, 0, 0, 0,
      0, -2 * bt, 0, 0,
      0, 0, 2 * nf, 0,
      (left + right) * lr, (top + bottom) * bt, (farClip + nearClip) * nf, 1
    ];

    return mat
  }

  /**
   * Constructs a translation matrix based on the specified offsets.
   *
   * A translation matrix is used to move a vector by a given offset.
   *
   * @static
   * @param {Vec3} offset - The offset to translate by.
   * @returns {Mat4} - The constructed translation matrix.
   */
  static translation({ x, y, z }: Vec3): Mat4 {
    const mat = new Mat4()

    // prettier-ignore
    mat._data = [
      1, 0, 0, 0, // Column 1
      0, 1, 0, 0, // Column 2
      0, 0, 1, 0, // Column 3
      x, y, z, 1, // Column 4
    ];

    return mat
  }
}
