import { Shader } from '../../gl/shader'
import { Mat4 } from '../math/mat4'
import { Transform } from '../math/transform'

/**
 * Represents an entity in the world.
 */
export class Entity {
  /**
   * The name of the entity.
   */
  name: string
  /**
   * The transform of the entity.
   */
  transform: Transform = new Transform()

  /**
   * The unique ID of the entity.
   */
  private _id: number
  /**
   * The children entities of this entity.
   */
  private _children: Entity[] = []
  /**
   * The parent entity of this entity.
   */
  private _parent: Entity | undefined
  /**
   * Whether or not this entity has been loaded.
   */
  private _isLoaded: boolean = false
  /**
   * The local transformation matrix of this entity.
   */
  private _localMatrix: Mat4 = Mat4.identity()
  /**
   * The world transformation matrix of this entity.
   */
  private _worldMatrix: Mat4 = Mat4.identity()

  /**
   * Initializes a new Entity.
   * @param id The unique ID of the entity.
   * @param name The name of the entity.
   */
  constructor(id: number, name: string) {
    this._id = id
    this.name = name
  }

  /**
   * Retrieves the identifier of the entity.
   */
  get id(): number {
    return this._id
  }
  /**
   * Retrieves the parent of the entity.
   */
  get parent(): Entity | undefined {
    return this._parent
  }
  /**
   * Returns whether or not the entity has been loaded.
   */
  get isLoaded(): boolean {
    return this.isLoaded
  }
  /**
   * Retrieves the world transformation matrix of the entity.
   */
  get worldMatrix(): Mat4 {
    return this._worldMatrix
  }

  /**
   * Adds a child entity to this entity.
   * @param entity The entity to add as a child.
   */
  addChild(entity: Entity) {
    entity._parent = this
    this._children.push(entity)
  }

  /**
   * Removes a child entity from this entity.
   * @param entity The entity to remove as a child.
   */
  removeChild(entity: Entity) {
    const index = this._children.indexOf(entity)
    if (index !== -1) {
      entity._parent = undefined
      this._children.splice(index, 1)
    }
  }

  /**
   * Retrieves the entity with the given name.
   * @param name The name of the entity to retrieve.
   * @returns The entity with the given name, or undefined if no entity with the given name exists.
   */
  getEntityByName(name: string): Entity | undefined {
    if (this.name === name) {
      return this
    }

    for (const child of this._children) {
      const entity = child.getEntityByName(name)
      if (entity !== undefined) {
        return entity
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
