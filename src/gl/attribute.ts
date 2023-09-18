/**
 * Holds the specification for an attribute within a WebGL buffer.
 * @class
 */
export class AttributeInfo {
  /** Specifies the location of the attribute in the buffer. */
  location: number

  /** Defines the number of elements within this attribute. For example, a Vector3 would have a size of 3. */
  size: number

  /** Specifies how many elements the attribute is offset from the start of the buffer. */
  offset: number

  /**
   * Creates an attribute information instance.
   * @param location - The location of the attribute.
   * @param size - The number of elements in the attribute.
   * @param offset - The offset of the attribute from the beginning of the buffer.
   */
  constructor(location: number, size: number, offset: number) {
    this.location = location
    this.size = size
    this.offset = offset
  }
}
