import { v4 as uuidv4 } from 'uuid'
import { Shader } from '../../gl/shader'
import { Scene } from './scene'
import { Node } from './node'
import { ComponentManager } from '../component/component-manager'
import { BehaviorManager } from '../behavior/behavior-manager'

/**
 * Lists the possible states of a zone.
 */
export enum ZoneState {
  UNINITIALIZED,
  LOADING,
  UPDATING,
}

/**
 * Represents a zone in the game.
 * A zone wraps a scene and provides a way to load and unload it.
 */
export class Zone {
  private _id: number
  private _name: string
  private _description: string
  private _scene: Scene
  private _state: ZoneState = ZoneState.UNINITIALIZED

  /**
   * Initializes a new Zone.
   * @param id The unique ID of the zone.
   * @param name The name of the zone.
   * @param description The description of the zone.
   */
  constructor(id: number, name: string, description?: string) {
    this._id = id
    this._name = name
    this._description = description ?? ''
    this._scene = new Scene()
  }

  /**
   * Retrieves the unique ID of the zone.
   */
  get id(): number {
    return this._id
  }
  /**
   * Retrieves the name of the zone.
   */
  get name(): string {
    return this._name
  }
  /**
   * Retrieves the description of the zone.
   */
  get description(): string {
    return this._description
  }
  /**
   * Retrieves the scene attached to the zone.
   */
  get scene(): Scene {
    return this._scene
  }

  init(zoneData: any) {
    if (zoneData.nodes === undefined) {
      throw new Error(`Zone ${this._id} has no nodes.`)
    }

    for (const node of zoneData.nodes) {
      this.loadNode(node, this._scene.root)
    }
  }

  /**
   * Loads the scene.
   */
  load() {
    this._state = ZoneState.LOADING
    this._scene.load()
    this._state = ZoneState.UPDATING
  }

  /**
   * Unloads the scene.
   */
  unload() {
    // TODO: Implement
  }

  /**
   * Updates the scene.
   * @param time The time since the last update in milliseconds.
   */
  update(time: number) {
    if (this._state === ZoneState.UPDATING) {
      this._scene.update(time)
    }
  }

  /**
   * Draws the scene.
   * @param shader The shader to use to draw the scene.
   */
  draw(shader: Shader) {
    if (this._state === ZoneState.UPDATING) {
      this._scene.draw(shader)
    }
  }

  /**
   * Called when the zone is activated.
   */
  onActivated() {
    // TODO: Implement
  }

  /**
   * Called when the zone is deactivated.
   */
  onDeactivated() {
    // TODO: Implement
  }

  private loadNode(nodeData: any, parent?: Node) {
    let name: string = ''
    if (nodeData.name !== undefined) {
      name = String(nodeData.name)
    }

    let node = new Node(uuidv4(), name, this._scene)

    if (nodeData.transform) {
      node.transform.setFromJson(nodeData.transform)
    }

    if (nodeData.components) {
      for (const componentData of nodeData.components) {
        const component = ComponentManager.extractComponent(componentData)
        node.addComponent(component)
      }
    }

    if (nodeData.behaviors) {
      for (const behaviorData of nodeData.behaviors) {
        const behavior = BehaviorManager.extractBehavior(behaviorData)
        node.addBehavior(behavior)
      }
    }

    if (nodeData.children) {
      for (const childData of nodeData.children) {
        this.loadNode(childData, node)
      }
    }

    if (parent) {
      parent.addChild(node)
    }
  }
}
