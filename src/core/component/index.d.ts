import { Node } from '../world/node'
import { Component } from './component'

export interface IComponent {
  name: string | undefined
  protected owner: Node
  setOwner(owner: Node): void
  load(): void
  update(_time: number): void
  draw(_shader: Shader): void
}

export interface IComponentData {
  name: string | undefined
  setFromJson(json: any): void
}

export interface IComponentBuilder {
  readonly type: string
  buildFromJson(json: any): IComponent
}
