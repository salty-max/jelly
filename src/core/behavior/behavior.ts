import { IBehavior, IBehaviorData } from '.'
import { Node } from '../world/node'

export abstract class Behavior implements IBehavior {
  name: string

  protected _data: IBehaviorData

  private _owner!: Node

  constructor(data: IBehaviorData) {
    this.name = data.name
    this._data = data
  }

  get owner(): Node {
    return this._owner
  }

  setOwner(owner: Node): void {
    this._owner = owner
  }

  update(_time: number): void {}

  apply(_userData: any): void {}
}
