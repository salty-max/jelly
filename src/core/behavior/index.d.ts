import { Node } from "../world/node"

export interface IBehavior {
  name: string
  protected owner: Node
  
  setOwner(owner: Node): void
  update(time: number): void
  apply(userData: any): void
}

export interface IBehaviorBuilder {
  readonly type: string
  buildFromJson(json: any): IBehavior
}

export interface IBehaviorData {
  name: string
  setFromJson(json: any): void
}
