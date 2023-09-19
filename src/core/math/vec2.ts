/**
 * Represents a two-dimensional vector, commonly used in 2D computations and graphics.
 * @class
 */
export class Vec2 {
  private _x: number
  private _y: number

  /**
   * Initializes a new instance of the Vec2 class.
   * @param {number} [x=0] - The initial value for the X component of the vector.
   * @param {number} [y=0] - The initial value for the Y component of the vector.
   */
  constructor(x: number = 0, y: number = 0) {
    this._x = x
    this._y = y
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
   * Converts the vector to an array representation.
   * @returns {number[]} - An array containing the components [X, Y] of the vector.
   */
  toArray(): number[] {
    return [this._x, this._y]
  }

  /**
   * Converts the vector to a Float32Array representation.
   * @returns {Float32Array} - A Float32Array containing the components [X, Y] of the vector.
   */
  toFloat32Array(): Float32Array {
    return new Float32Array(this.toArray())
  }

  /**
   * Creates a new vector with the same component values as the current Vec3 instance.
   * @param other The vector to copy from.
   */
  copyFrom(other: Vec2) {
    this._x = other._x
    this._y = other._y
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
  }

  /**
   * Creates a new vector with all components set to zero.
   * @returns {Vec3} - A new Vec2 instance with all components initialized to 0.
   * @static
   */
  static zero(): Vec2 {
    return new Vec2()
  }
}
