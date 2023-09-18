import { Material } from './material'

class MaterialReferenceNode {
  material: Material
  referenceCount = 1

  public constructor(material: Material) {
    this.material = material
  }
}

export class MaterialManager {
  private static _materials: Record<string, MaterialReferenceNode | undefined> =
    {}

  private constructor() {}

  static registerMaterial(material: Material) {
    let matNode = MaterialManager._materials[material.name]
    if (!matNode) {
      matNode = new MaterialReferenceNode(material)
      MaterialManager._materials[material.name] = matNode
    }
  }

  static getMaterial(name: string): Material | undefined {
    const matNode = this._materials[name]
    if (!matNode) {
      return undefined
    } else {
      matNode.referenceCount++
      return matNode.material
    }
  }

  static releaseMaterial(name: string) {
    const matNode = this._materials[name]
    if (!matNode) {
      console.warn(`Cannot release ${name}. Material not registered.`)
      return
    }

    matNode.referenceCount--
    if (matNode.referenceCount <= 0) {
      matNode.material.destroy()
      delete this._materials[name]
    }
  }
}
