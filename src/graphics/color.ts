export class Color {
  private _r: number
  private _g: number
  private _b: number
  private _a: number

  constructor(r: number = 0, g: number = 0, b: number = 0, a: number = 255) {
    this._r = r
    this._g = g
    this._b = b
    this._a = a
  }

  get r(): number {
    return this._r
  }
  get rFloat(): number {
    return this._r / 255
  }
  set r(value: number) {
    this._r = value
  }
  get g(): number {
    return this._g
  }
  get gFloat(): number {
    return this._g / 255
  }
  set g(value: number) {
    this._g = value
  }
  get b(): number {
    return this._b
  }
  get bFloat(): number {
    return this._b / 255
  }
  set b(value: number) {
    this._b = value
  }
  get a(): number {
    return this._a
  }
  get aFloat(): number {
    return this._a / 255
  }
  set a(value: number) {
    this._a = value
  }

  toArray(): number[] {
    return [this._r, this._g, this._b, this._a]
  }

  toFloatArray(): number[] {
    return [this._r / 255, this._g / 255, this._b / 255, this._a / 255]
  }

  toFloat32Array(): Float32Array {
    return new Float32Array(this.toFloatArray())
  }

  static black(): Color {
    return new Color(0, 0, 0, 255)
  }
  static white(): Color {
    return new Color(255, 255, 255, 255)
  }
  static red(): Color {
    return new Color(255, 0, 0, 255)
  }
  static green(): Color {
    return new Color(0, 255, 0, 255)
  }
  static blue(): Color {
    return new Color(0, 0, 255, 255)
  }
  static yellow(): Color {
    return new Color(255, 255, 0, 255)
  }
  static cyan(): Color {
    return new Color(0, 255, 255, 255)
  }
  static magenta(): Color {
    return new Color(255, 0, 255, 255)
  }
  static gray(): Color {
    return new Color(128, 128, 128, 255)
  }
}
