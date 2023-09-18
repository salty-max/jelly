import { gl } from './gl'

export type ShaderAttribute = Record<string, number>

export type ShaderUniform = Record<string, WebGLUniformLocation>

/**
 * Represents a WebGL shader.
 */
export class Shader {
  private _name: string
  private _program!: WebGLProgram
  private _attributes: ShaderAttribute = {}
  private _uniforms: ShaderUniform = {}

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
    this.detectAttributes()
    this.detectUniforms()
  }

  /**
   * The name of the shader.
   */
  get name(): string {
    return this._name
  }

  /**
   * Gets the location of an attribute.
   * @param name The name of the attribute whose location to retrieve.
   * @returns The location of the attribute.
   */
  getAttribLocation(name: string): number {
    const loc = this._attributes[name]
    if (loc === undefined) {
      throw new Error(`Attribute ${name} not found in shader ${this._name}`)
    }

    return loc
  }

  /**
   * Gets the location of an attribute.
   * @param name The name of the attribute whose location to retrieve.
   * @returns The location of the attribute.
   */
  getUniformLocation(name: string): WebGLUniformLocation {
    const loc = this._uniforms[name]
    if (loc === undefined) {
      throw new Error(`Uniform ${name} not found in shader ${this._name}`)
    }

    return loc
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

  private detectAttributes() {
    const attribCount: number = gl.getProgramParameter(
      this._program,
      gl.ACTIVE_ATTRIBUTES,
    )

    for (let i = 0; i < attribCount; i++) {
      const info = gl.getActiveAttrib(this._program, i)
      if (!info) {
        throw new Error(`Error getting attribute ${i} for shader ${this._name}`)
      }

      this._attributes[info.name] = gl.getAttribLocation(
        this._program,
        info.name,
      )
    }
  }

  private detectUniforms() {
    const uniformCount: number = gl.getProgramParameter(
      this._program,
      gl.ACTIVE_UNIFORMS,
    )

    for (let i = 0; i < uniformCount; i++) {
      const info = gl.getActiveUniform(this._program, i)
      if (!info) {
        throw new Error(`Error getting uniform ${i} for shader ${this._name}`)
      }

      const loc = gl.getUniformLocation(this._program, info.name)
      if (!loc) {
        throw new Error(
          `Error getting uniform location for ${info.name} in shader ${this._name}`,
        )
      }

      this._uniforms[info.name] = loc
    }
  }
}
