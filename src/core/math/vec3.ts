/**
 * Represents a three-dimensional vector, commonly used in 3D computations and graphics.
 * @class
 */
export class Vec3 {
  private _x: number
  private _y: number
  private _z: number

  /**
   * Initializes a new instance of the Vec3 class.
   * @param {number} [x=0] - The initial value for the X component of the vector.
   * @param {number} [y=0] - The initial value for the Y component of the vector.
   * @param {number} [z=0] - The initial value for the Z component of the vector.
   */
  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this._x = x
    this._y = y
    this._z = z
  }

  /**
   * Retrieves the X component of the vector.
   * @returns {number} - The X component value.
   */
  get x(): number {
    return this._x
  }

  /**
   * Retrieves the Y component of the vector.
   * @returns {number} - The Y component value.
   */
  get y(): number {
    return this._y
  }

  /**
   * Retrieves the Z component of the vector.
   * @returns {number} - The Z component value.
   */
  get z(): number {
    return this._z
  }

  /**
   * Assigns a new value to the X component of the vector.
   * @param {number} value - The new X component value.
   */
  set x(value: number) {
    this._x = value
  }

  /**
   * Assigns a new value to the Y component of the vector.
   * @param {number} value - The new Y component value.
   */
  set y(value: number) {
    this._y = value
  }

  /**
   * Assigns a new value to the Z component of the vector.
   * @param {number} value - The new Z component value.
   */
  set z(value: number) {
    this._z = value
  }

  /**
   * Creates a new vector with all components set to zero.
   * @returns {Vec3} - A new Vec3 instance with all components initialized to 0.
   * @static
   */
  static get zero(): Vec3 {
    return new Vec3()
  }

  /**
   * Creates a new vector with all components set to one.
   * @returns {Vec3} - A new Vec3 instance with all components initialized to 1.
   * @static
   */
  static get one(): Vec3 {
    return new Vec3(1, 1, 1)
  }

  /**
   * Converts the vector to an array representation.
   * @returns {number[]} - An array containing the components [X, Y, Z] of the vector.
   */
  toArray(): number[] {
    return [this._x, this._y, this._z]
  }

  /**
   * Converts the vector to a Float32Array representation.
   * @returns {Float32Array} - A Float32Array containing the components [X, Y, Z] of the vector.
   */
  toFloat32Array(): Float32Array {
    return new Float32Array(this.toArray())
  }

  /**
   * Creates a new vector with the same component values as the current Vec3 instance.
   * @param other The vector to copy from.
   */
  copyFrom(other: Vec3) {
    this._x = other._x
    this._y = other._y
    this._z = other._z
  }

  /**
   * Sets the components of the vector from JSON data.
   * @param json The JSON object to deserialize from.
   */
  setFromJson(json: any): void {
    if (json.x !== undefined) {
      this._x = Number(json.x)
    }
    if (json.y !== undefined) {
      this._y = Number(json.y)
    }
    if (json.z !== undefined) {
      this._z = Number(json.z)
    }
  }
}
