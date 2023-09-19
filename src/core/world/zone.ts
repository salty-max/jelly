import { Shader } from '../../gl/shader'
import { Scene } from './scene'

export enum ZoneState {
  UNINITIALIZED,
  LOADING,
  UPDATING,
}

export class Zone {
  private _id: number
  private _name: string
  private _description: string
  private _scene: Scene
  private _state: ZoneState = ZoneState.UNINITIALIZED

  constructor(id: number, name: string, description?: string) {
    this._id = id
    this._name = name
    this._description = description ?? ''
    this._scene = new Scene()
  }

  get id(): number {
    return this._id
  }
  get name(): string {
    return this._name
  }
  get description(): string {
    return this._description
  }
  get scene(): Scene {
    return this._scene
  }

  load() {
    this._state = ZoneState.LOADING
    this._scene.load()
    this._state = ZoneState.UPDATING
  }

  unload() {
    // TODO: Implement
  }

  update(time: number) {
    if (this._state === ZoneState.UPDATING) {
      this._scene.update(time)
    }
  }

  draw(shader: Shader) {
    if (this._state === ZoneState.UPDATING) {
      this._scene.draw(shader)
    }
  }

  onActivated() {
    // TODO: Implement
  }

  onDeactivated() {
    // TODO: Implement
  }
}
