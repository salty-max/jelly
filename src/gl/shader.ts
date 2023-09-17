import { gl } from './gl'

/**
 * Represents a WebGL shader.
 */
export class Shader {
  private _name: string
  private _program!: WebGLProgram

  /**
   * Creates a new shader.
   * @param name The name of the shader.
   * @param vertexSource The source of the vertex shader.
   * @param fragmentSource The source of the fragment shader.
   */
  constructor(name: string, vertexSource: string, fragmentSource: string) {
    this._name = name
    const vertexShader = this.loadShader(vertexSource, gl.VERTEX_SHADER)
    const fragmentShader = this.loadShader(fragmentSource, gl.FRAGMENT_SHADER)

    this.createProgram(vertexShader, fragmentShader)
  }

  /**
   * The name of the shader.
   */
  get name(): string {
    return this._name
  }

  /**
   * Use this shader.
   */
  use() {
    gl.useProgram(this._program)
  }

  private loadShader(source: string, type: number): WebGLShader {
    const shader: WebGLShader = gl.createShader(type) as WebGLShader

    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    const error = gl.getShaderInfoLog(shader)
    if (error) {
      throw new Error(`Error compiling shader ${this._name}: ${error}`)
    }

    return shader
  }

  private createProgram(
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader,
  ) {
    const prg = gl.createProgram()
    if (!prg) {
      throw new Error(`Error creating shader program ${this._name}`)
    }

    this._program = prg
    gl.attachShader(this._program, vertexShader)
    gl.attachShader(this._program, fragmentShader)

    gl.linkProgram(this._program)

    const error = gl.getProgramInfoLog(this._program)
    if (error) {
      throw new Error(`Error linking shader ${this._name}: ${error}`)
    }
  }
}
