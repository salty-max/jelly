import { v4 as uuidv4 } from 'uuid'
import { Shader } from '../../gl/shader'
import { Node } from './node'

/**
 * Represents a scene in the game.
 * A scene is a collection of nodes.
 */
export class Scene {
  private _root: Node

  /**
   * Initializes a new Scene.
   */
  constructor() {
    this._root = new Node(uuidv4(), '__ROOT__', this)
  }

  /**
   * Retrieves the root node of the scene.
   */
  get root(): Node {
    return this._root
  }

  get isLoaded(): boolean {
    return this._root.isLoaded
  }

  /**
   * Adds an node to the scene.
   * @param node The node to add to the scene.
   */
  addNode(node: Node): void {
    this._root.addChild(node)
  }

  /**
   * Retrieves a node from the scene by its name.
   * @param name The name of the node to retrieve.
   * @returns The node with the given name, or undefined if no node with that name exists.
   */
  getNodeByName(name: string): Node | undefined {
    return this._root.getNodeByName(name)
  }

  /**
   * Loads the scene.
   */
  load(): void {
    this._root.load()
  }

  /**
   * Updates the scene.
   * @param time The time since the last update in milliseconds.
   */
  update(time: number): void {
    this._root.update(time)
  }

  /**
   * Draws the scene.
   * @param shader The shader to use to draw the scene.
   */
  draw(shader: Shader): void {
    this._root.draw(shader)
  }
}
