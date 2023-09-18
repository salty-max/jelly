import { Color } from './color'
import { Texture } from './texture'
import { TextureManager } from './texture-manager'

export class Material {
  private _name: string
  private _diffuseTextureName: string
  private _diffuseTexture: Texture | undefined
  private _tint: Color

  constructor(
    name: string,
    diffuseTextureName: string,
    tint: Color = Color.white(),
  ) {
    this._name = name
    this._diffuseTextureName = diffuseTextureName
    this._tint = tint

    this._diffuseTexture = TextureManager.getTexture(this._diffuseTextureName)
  }

  get name(): string {
    return this._name
  }

  get diffuseTextureName(): string {
    return this._diffuseTextureName
  }
  set diffuseTextureName(value: string) {
    if (this._diffuseTexture) {
      TextureManager.releaseTexture(this._diffuseTextureName)
    }
    this._diffuseTextureName = value
    this._diffuseTexture = TextureManager.getTexture(this._diffuseTextureName)
  }

  get diffuseTexture(): Texture | undefined {
    return this._diffuseTexture
  }

  get tint(): Color {
    return this._tint
  }

  destroy() {
    TextureManager.releaseTexture(this._diffuseTextureName)
    this._diffuseTexture = undefined
  }
}
