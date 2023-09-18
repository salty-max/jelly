import { Vec3 } from '../core/math/vec3'
import { AttributeInfo } from '../gl/attribute'
import { gl } from '../gl/gl'
import { GLBuffer } from '../gl/gl-buffer'
import { Shader } from '../gl/shader'
import { Texture } from './texture'
import { TextureManager } from './texture-manager'

/**
 * Encapsulates the concept of a sprite, a two-dimensional image or animation integrated into a larger scene.
 *
 * Each sprite has a defined width, height, and underlying graphical representation stored in a buffer.
 * @class
 */
export class Sprite {
  private _name: string
  private _width: number
  private _height: number
  private _buffer!: GLBuffer
  private _textureName: string
  private _texture: Texture

  position: Vec3 = Vec3.zero()

  /**
   * Constructs a new sprite with the given name and dimensions.
   *
   * @param {string} name - A unique identifier for the sprite.
   * @param {string} textureName - The name of the texture to use for the sprite.
   * @param {number} width - The width of the sprite in pixels.
   * @param {number} height - The height of the sprite in pixels.
   */
  constructor(
    name: string,
    textureName: string,
    width: number = 100,
    height: number = 100,
  ) {
    this._name = name
    this._width = width
    this._height = height
    this._textureName = textureName
    this._texture = TextureManager.getTexture(this._textureName)
  }

  /**
   * Retrieves the name of the sprite.
   */
  get name(): string {
    return this._name
  }

  destroy() {
    this._buffer.destroy()
    TextureManager.releaseTexture(this._textureName)
  }

  /**
   * Initializes the sprite by generating its underlying buffer representation.
   *
   * This method creates the necessary vertex data for the sprite and pushes it to the GPU.
   */
  load() {
    const positionAttrib = new AttributeInfo(0, 3, 0)
    const texCoordAttrib = new AttributeInfo(1, 2, 3)

    // prettier-ignore
    const vertices: number[] = [
      // x, y, z, u, v
      0, 0, 0, 0, 0,
      0, this._height, 0, 0, 1,
      this._width, this._height, 0, 1, 1,
      this._width, this._height, 0, 1, 1,
      this._width, 0, 0, 1, 0,
      0, 0, 0, 0, 0
    ]

    this._buffer = new GLBuffer(5)
    this._buffer.addAttributeLocation(positionAttrib)
    this._buffer.addAttributeLocation(texCoordAttrib)
    this._buffer.pushBackData(vertices)
    this._buffer.upload()
    this._buffer.unbind()
  }

  /**
   * Updates the sprite based on the elapsed time.
   * @param {number} time - The elapsed time since the last frame.
   */
  update(time: number) {
    console.log(time)
  }

  /**
   * Renders the sprite to the screen.
   *
   * This method binds the underlying buffer and triggers the drawing process, rendering the sprite.
   */
  draw(shader: Shader) {
    this._texture.activateAndBind(0)
    const diffuseLocation = shader.getUniformLocation('u_diffuse')
    gl.uniform1i(diffuseLocation, 0)

    this._buffer.bind()
    this._buffer.draw()
  }
}
