import { Texture } from './texture'

class TextureReferenceNode {
  texture: Texture
  referenceCount = 1

  constructor(texture: Texture) {
    this.texture = texture
  }
}

export class TextureManager {
  private static _textures: Record<string, TextureReferenceNode | undefined> =
    {}

  private constructor() {}

  static getTexture(name: string): Texture {
    let texNode = this._textures[name]
    if (!texNode) {
      const tex = new Texture(name)
      texNode = new TextureReferenceNode(tex)
    } else {
      texNode.referenceCount++
    }

    return texNode.texture
  }

  static releaseTexture(name: string) {
    let texNode = this._textures[name]
    if (!texNode) {
      console.warn(`Cannot release ${name}. Texture not found.`)
      return
    }

    texNode.referenceCount--
    if (texNode.referenceCount <= 0) {
      texNode.texture.destroy()
      texNode = undefined
      delete this._textures[name]
    }
  }
}
