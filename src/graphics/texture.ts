import { IMessageHandler } from '../core/message'
import { Message } from '../core/message/message'
import { ImageResource } from '../core/resource/image-resource-loader'
import {
  MESSAGE_RESOURCE_LOADER_RESOURCE_LOADED,
  ResourceManager,
} from '../core/resource/resource-manager'
import { gl } from '../gl/gl'

const LEVEL = 0
const BORDER = 0
const TEMP_IMAGE_DATA = new Uint8Array([255, 255, 255, 255])

export class Texture implements IMessageHandler {
  private _name: string
  private _handle: WebGLTexture
  private _isLoaded = false
  private _width: number
  private _height: number

  constructor(name: string, width: number = 1, height: number = 1) {
    this._name = name
    this._width = width
    this._height = height

    const tex = gl.createTexture()
    if (!tex) {
      throw new Error('Unable to create texture')
    }
    this._handle = tex

    Message.subscribe(MESSAGE_RESOURCE_LOADER_RESOURCE_LOADED + this.name, this)

    this.bind()

    gl.texImage2D(
      gl.TEXTURE_2D,
      LEVEL,
      gl.RGBA,
      1,
      1,
      BORDER,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      TEMP_IMAGE_DATA,
    )

    const resource = ResourceManager.getResource(this.name) as ImageResource
    if (resource) {
      this.loadTextureFromResource(resource)
    }
  }

  get name(): string {
    return this._name
  }
  get isLoaded(): boolean {
    return this._isLoaded
  }
  get width(): number {
    return this._width
  }
  get height(): number {
    return this._height
  }

  destroy() {
    gl.deleteTexture(this._handle)
  }

  activateAndBind(textureUnit = 0) {
    gl.activeTexture(gl.TEXTURE0 + textureUnit)
    this.bind()
  }

  bind() {
    gl.bindTexture(gl.TEXTURE_2D, this._handle)
  }

  unbind() {
    gl.bindTexture(gl.TEXTURE_2D, null)
  }

  onMessage(message: Message) {
    if (message.code === MESSAGE_RESOURCE_LOADER_RESOURCE_LOADED + this.name) {
      this.loadTextureFromResource(message.context as ImageResource)
    }
  }

  private loadTextureFromResource(resource: ImageResource) {
    this._width = resource.width
    this._height = resource.height

    this.bind()

    gl.texImage2D(
      gl.TEXTURE_2D,
      LEVEL,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      resource.data,
    )

    if (this.isPowerOfTwo()) {
      gl.generateMipmap(gl.TEXTURE_2D)
    } else {
      // Do not generate a mip map and clamp wrapping to edge
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    }

    this._isLoaded = true
  }

  private isPowerOfTwo() {
    return (
      this.isValuePowerOfTwo(this._width) &&
      this.isValuePowerOfTwo(this._height)
    )
  }

  private isValuePowerOfTwo(value: number) {
    return (value & (value - 1)) === 0
  }
}
