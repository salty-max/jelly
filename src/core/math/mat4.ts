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
  /**
   * Constructs a rotationX matrix based on the specified angle.
   *
   * A rotationX matrix is used to rotate a vector by a given angle on the X axis.
   *
   * @param angle The angle in radians to rotate by.
   * @returns The constructed rotationX matrix.
   */
  static rotationX(angleInRadians: number): Mat4 {
    const m = new Mat4()

    const c = Math.cos(angleInRadians)
    const s = Math.sin(angleInRadians)

    m._data[5] = c
    m._data[6] = s
    m._data[9] = -s
    m._data[10] = c

    return m
  }

  /**
   * Constructs a rotationY matrix based on the specified angle.
   *
   * A rotationY matrix is used to rotate a vector by a given angle on the Y axis.
   *
   * @param angleInRadians The angle in radians to rotate by.
   * @returns The constructed rotationY matrix.
   */
  static rotationY(angleInRadians: number): Mat4 {
    const m = new Mat4()

    const c = Math.cos(angleInRadians)
    const s = Math.sin(angleInRadians)

    m._data[0] = c
    m._data[2] = -s
    m._data[8] = s
    m._data[10] = c

    return m
  }

  /**
   * Constructs a rotationZ matrix based on the specified angle.
   *
   * A rotationZ matrix is used to rotate a vector by a given angle on the Z axis.
   *
   * @param angleInRadians The angle in radians to rotate by.
   * @returns The constructed rotationY matrix.
   */
  static rotationZ(angleInRadians: number): Mat4 {
    const m = new Mat4()

    const c = Math.cos(angleInRadians)
    const s = Math.sin(angleInRadians)

    m._data[0] = c
    m._data[1] = s
    m._data[4] = -s
    m._data[5] = c

    return m
  }

  static rotationXYZ(
    xRadians: number,
    yRadians: number,
    zRadians: number,
  ): Mat4 {
    let rx = Mat4.rotationX(xRadians)
    let ry = Mat4.rotationY(yRadians)
    let rz = Mat4.rotationZ(zRadians)

    // ZYX
    return Mat4.multiply(Mat4.multiply(rz, ry), rx)
  }

  /**
   * Constructs a scaling matrix based on the specified scaling factor.
   * @param factor The factor to scale by.
   * @returns The constructed scaling matrix.
   */
  static scale({ x, y, z }: Vec3): Mat4 {
    const mat = new Mat4()

    // prettier-ignore
    mat._data = [
      x, 0, 0, 0, // Column 1
      0, y, 0, 0, // Column 2
      0, 0, z, 0, // Column 3
      0, 0, 0, 1, // Column 4
    ];

    return mat
  }

  /**
   * Multiplies two matrices together.
   * @param a The first matrix to multiply.
   * @param b The second matrix to multiply.
   * @returns The product of the two matrices.
   */
  static multiply(a: Mat4, b: Mat4): Mat4 {
    const m = new Mat4()

    const b00 = b._data[0 * 4 + 0]
    const b01 = b._data[0 * 4 + 1]
    const b02 = b._data[0 * 4 + 2]
    const b03 = b._data[0 * 4 + 3]
    const b10 = b._data[1 * 4 + 0]
    const b11 = b._data[1 * 4 + 1]
    const b12 = b._data[1 * 4 + 2]
    const b13 = b._data[1 * 4 + 3]
    const b20 = b._data[2 * 4 + 0]
    const b21 = b._data[2 * 4 + 1]
    const b22 = b._data[2 * 4 + 2]
    const b23 = b._data[2 * 4 + 3]
    const b30 = b._data[3 * 4 + 0]
    const b31 = b._data[3 * 4 + 1]
    const b32 = b._data[3 * 4 + 2]
    const b33 = b._data[3 * 4 + 3]
    const a00 = a._data[0 * 4 + 0]
    const a01 = a._data[0 * 4 + 1]
    const a02 = a._data[0 * 4 + 2]
    const a03 = a._data[0 * 4 + 3]
    const a10 = a._data[1 * 4 + 0]
    const a11 = a._data[1 * 4 + 1]
    const a12 = a._data[1 * 4 + 2]
    const a13 = a._data[1 * 4 + 3]
    const a20 = a._data[2 * 4 + 0]
    const a21 = a._data[2 * 4 + 1]
    const a22 = a._data[2 * 4 + 2]
    const a23 = a._data[2 * 4 + 3]
    const a30 = a._data[3 * 4 + 0]
    const a31 = a._data[3 * 4 + 1]
    const a32 = a._data[3 * 4 + 2]
    const a33 = a._data[3 * 4 + 3]

    m._data[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30
    m._data[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31
    m._data[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32
    m._data[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33
    m._data[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30
    m._data[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31
    m._data[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32
    m._data[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33
    m._data[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30
    m._data[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31
    m._data[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32
    m._data[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33
    m._data[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30
    m._data[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31
    m._data[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32
    m._data[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33

    return m
  }

  toFloat32Array(): Float32Array {
    return new Float32Array(this._data)
  }

  copyFrom(other: Mat4) {
    this._data = [...other._data]
  }
}
