import { Shader } from '../../gl/shader'
import { IBehavior } from '../behavior'
import { IComponent } from '../component'
import { Mat4 } from '../math/mat4'
import { Transform } from '../math/transform'
import { Scene } from './scene'

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

  private _id: string
  private _isLoaded: boolean = false
  private _children: Node[] = []
  private _parent: Node | undefined
  private _scene: Scene | undefined
  private _components: IComponent[] = []
  private _behaviors: IBehavior[] = []
  private _localMatrix: Mat4 = Mat4.identity()
  private _worldMatrix: Mat4 = Mat4.identity()

  /**
   * Initializes a new Node.
   * @param id The unique ID of the node.
   * @param name The name of the node.
   */
  constructor(id: string, name: string, scene?: Scene) {
    this._id = id
    this.name = name
    this._scene = scene
  }

  /**
   * Retrieves the identifier of the node.
   */
  get id(): string {
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
    return this._isLoaded
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
    if (this._scene) {
      node.onAdded(this._scene)
    }
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

  /**
   * Adds a component to the node.
   * @param component The component to add to the node.
   */
  addComponent(component: IComponent) {
    this._components.push(component)
    component.setOwner(this)
  }

  addBehavior(behavior: IBehavior) {
    this._behaviors.push(behavior)
    behavior.setOwner(this)
  }

  /**
   * Loads the node and its children.
   */
  load() {
    this._isLoaded = true

    for (const component of this._components) {
      component.load()
    }

    for (const child of this._children) {
      child.load()
    }
  }

  /**
   * Updates the node and its children.
   * @param time The time since the last update in milliseconds.
   */
  update(time: number) {
    this._localMatrix = this.transform.getTransformationMatrix()
    this.updateWorldMatrix(this._parent ? this._parent.worldMatrix : undefined)

    for (const component of this._components) {
      component.update(time)
    }

    for (const behavior of this._behaviors) {
      behavior.update(time)
    }

    for (const child of this._children) {
      child.update(time)
    }
  }

  /**
   * Draws the node and its children.
   * @param shader The shader to use to draw the node.
   */
  draw(shader: Shader) {
    for (const component of this._components) {
      component.draw(shader)
    }

    for (const child of this._children) {
      child.draw(shader)
    }
  }

  /**
   * Called when the node is added to a scene.
   * @param scene The scene that the node was added to.
   */
  protected onAdded(scene: Scene) {
    this._scene = scene
  }

  private updateWorldMatrix(parentWorldMatrix?: Mat4) {
    if (parentWorldMatrix) {
      this._worldMatrix = Mat4.multiply(parentWorldMatrix, this._localMatrix)
    } else {
      this._worldMatrix.copyFrom(this._localMatrix)
    }

    for (const child of this._children) {
      child.updateWorldMatrix(this._worldMatrix)
    }
  }
}
