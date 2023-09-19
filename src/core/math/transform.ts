import { Mat4 } from './mat4'
import { Vec3 } from './vec3'

/**
 * Represents a transform in 3D space.
 */
export class Transform {
  /**
   * The position of the transform.
   */
  position: Vec3 = Vec3.zero
  /**
   * The rotation of the transform.
   */
  rotation: Vec3 = Vec3.zero
  /**
   * The scale of the transform.
   */
  scale: Vec3 = Vec3.one

  /**
   * Initializes a new Transform.
   */
  constructor() {}

  /**
   * Copies the values from the given transform into this transform.
   * @param transform The transform to copy from.
   */
  copyFrom(transform: Transform) {
    this.position.copyFrom(transform.position)
    this.rotation.copyFrom(transform.rotation)
    this.scale.copyFrom(transform.scale)
  }

  /**
   * Retrieves the transformation matrix for this transform.
   * @returns The transformation matrix for this transform.
   */
  getTransformationMatrix(): Mat4 {
    const translation = Mat4.translation(this.position)
    // TODO: Add x and y rotation for 3D
    const rotation = Mat4.rotationXYZ(
      this.rotation.x,
      this.rotation.y,
      this.rotation.z,
    )
    const scale = Mat4.scale(this.scale)

    // T * R * S
    return Mat4.multiply(Mat4.multiply(translation, rotation), scale)
  }
}
