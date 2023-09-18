import { Shader } from '../../gl/shader'
import { Mat4 } from '../math/mat4'
import { Transform } from '../math/transform'

/**
 * Represents an node in the world.
 */
export class Node {
  /**
   * The name of the node.
   */
  name: string
  /**
   * The transform of the node.
   */
  transform: Transform = new Transform()

  /**
   * The unique ID of the node.
   */
  private _id: number
  /**
   * The children nodes of this node.
   */
  private _children: Node[] = []
  /**
   * The parent node of this node.
   */
  private _parent: Node | undefined
  /**
   * Whether or not this node has been loaded.
   */
  private _isLoaded: boolean = false
  /**
   * The local transformation matrix of this node.
   */
  private _localMatrix: Mat4 = Mat4.identity()
  /**
   * The world transformation matrix of this node.
   */
  private _worldMatrix: Mat4 = Mat4.identity()

  /**
   * Initializes a new Node.
   * @param id The unique ID of the node.
   * @param name The name of the node.
   */
  constructor(id: number, name: string) {
    this._id = id
    this.name = name
  }

  /**
   * Retrieves the identifier of the node.
   */
  get id(): number {
    return this._id
  }
  /**
   * Retrieves the parent of the node.
   */
  get parent(): Node | undefined {
    return this._parent
  }
  /**
   * Returns whether or not the node has been loaded.
   */
  get isLoaded(): boolean {
    return this.isLoaded
  }
  /**
   * Retrieves the world transformation matrix of the node.
   */
  get worldMatrix(): Mat4 {
    return this._worldMatrix
  }

  /**
   * Adds a child node to this node.
   * @param node The node to add as a child.
   */
  addChild(node: Node) {
    node._parent = this
    this._children.push(node)
  }

  /**
   * Removes a child node from this node.
   * @param node The node to remove as a child.
   */
  removeChild(node: Node) {
    const index = this._children.indexOf(node)
    if (index !== -1) {
      node._parent = undefined
      this._children.splice(index, 1)
    }
  }

  /**
   * Retrieves the node with the given name.
   * @param name The name of the node to retrieve.
   * @returns The node with the given name, or undefined if no node with the given name exists.
   */
  getNodeByName(name: string): Node | undefined {
    if (this.name === name) {
      return this
    }

    for (const child of this._children) {
      const node = child.getNodeByName(name)
      if (node !== undefined) {
        return node
      }
    }

    return undefined
  }

  load() {
    this._isLoaded = true
    for (const child of this._children) {
      child.load()
    }
  }

  update(time: number) {
    for (const child of this._children) {
      child.update(time)
    }
  }

  draw(shader: Shader) {
    for (const child of this._children) {
      child.draw(shader)
    }
  }
}
