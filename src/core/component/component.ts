import { Shader } from '../../gl/shader'
import { Node } from '../world/node'

export abstract class Component {
  name: string

  protected _owner!: Node

  constructor(name: string) {
    this.name = name
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
