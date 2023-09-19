import { IComponent, IComponentData } from '.'
import { Shader } from '../../gl/shader'
import { Node } from '../world/node'

export abstract class Component implements IComponent {
  name: string | undefined

  protected _owner!: Node
  protected _data: IComponentData

  constructor(data: IComponentData) {
    this.name = data.name
    this._data = data
  }

  get owner(): Node {
    return this._owner
  }

  setOwner(owner: Node) {
    this._owner = owner
  }

  load() {}

  update(_time: number) {}

  draw(_shader: Shader) {}
}
