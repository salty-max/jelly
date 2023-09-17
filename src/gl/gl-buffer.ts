import { gl } from './gl'

/**
 * Represents the information needed for a WebGL buffer attribute
 */
export class AttributeInfo {
  /**
   * The location of the attribute.
   */
  location: number
  /**
   * The size (number of elements) in this attribute (i.e. Vector3 = 3).
   */
  size: number
  /**
   * The number of elements fron the beginning of the buffer.
   */
  offset: number

  /**
   *
   * @param location The location of the attribute.
   * @param size The size (number of elements) in this attribute (i.e. Vector3 = 3).
   * @param offset The number of elements fron the beginning of the buffer.
   */
  constructor(location: number, size: number, offset: number) {
    this.location = location
    this.size = size
    this.offset = offset
  }
}

export class GLBuffer {
  private _hasAttribLocation: boolean = false
  private _elementSize: number
  private _stride: number
  private _buffer: WebGLBuffer
  private _targetBufferType: number
  private _dataType: number
  private _mode: number
  private _typeSize: number
  private _data: number[] = []
  private attributes: AttributeInfo[] = []

  /**
   * Creates a new WebGL buffer
   * @param elementSize The size of each element in the buffer
   * @param dataType The data type of the buffer. Defaults to gl.FLOAT
   * @param targetBufferType The buffer target type. Can be either gl.ARRAY_BUFFER or gl.ELEMENT_ARRAY_BUFFER Defaults to gl.ARRAY_BUFFER
   * @param mode The draw mode. (i.e. gl.TRIANGLES or gl.LINES) Defaults to gl.TRIANGLES
   */
  constructor(
    elementSize: number,
    dataType: number = gl.FLOAT,
    targetBufferType: number = gl.ARRAY_BUFFER,
    mode: number = gl.TRIANGLES,
  ) {
    this._elementSize = elementSize
    this._dataType = dataType
    this._targetBufferType = targetBufferType
    this._mode = mode
    this._typeSize = this.getTypeSize(dataType)
    this._stride = this._elementSize * this._typeSize
    this._buffer = gl.createBuffer() as WebGLBuffer
  }

  /**
   * Deletes the buffer.
   */
  destroy() {
    gl.deleteBuffer(this._buffer)
  }

  /**
   * Binds this buffer.
   * @param is_normalized Indicated if the data should be normalized. Defaults to false.
   */
  bind(is_normalized: boolean = false) {
    gl.bindBuffer(this._targetBufferType, this._buffer)

    if (this._hasAttribLocation) {
      for (const a of this.attributes) {
        gl.vertexAttribPointer(
          a.location,
          a.size,
          this._dataType,
          is_normalized,
          this._stride,
          a.offset * this._typeSize,
        )
        gl.enableVertexAttribArray(a.location)
      }
    }
  }

  /**
   * Unbinds this buffer.
   */
  unbind() {
    for (const a of this.attributes) {
      gl.disableVertexAttribArray(a.location)
    }

    gl.bindBuffer(this._targetBufferType, null)
  }

  /**
   * Adds an attribute to this buffer.
   * @param info The attribute info to add.
   */
  addAttributeLocation(info: AttributeInfo) {
    this._hasAttribLocation = true
    this.attributes.push(info)
  }

  /**
   * Adds data to this buffer.
   * @param data The data to add.
   */
  pushBackData(data: number[]) {
    this._data.push(...data)
  }

  /**
   * Uploads this buffer's data to the GPU.
   */
  upload() {
    gl.bindBuffer(this._targetBufferType, this._buffer)

    let bufferData: ArrayBuffer
    switch (this._dataType) {
      case gl.FLOAT:
        bufferData = new Float32Array(this._data)
        break
      case gl.INT:
        bufferData = new Int32Array(this._data)
        break
      case gl.UNSIGNED_INT:
        bufferData = new Uint32Array(this._data)
        break
      case gl.SHORT:
        bufferData = new Int16Array(this._data)
        break
      case gl.UNSIGNED_SHORT:
        bufferData = new Uint16Array(this._data)
        break
      case gl.BYTE:
        bufferData = new Int8Array(this._data)
        break
      case gl.UNSIGNED_BYTE:
        bufferData = new Uint8Array(this._data)
        break
      default:
        throw new Error(`Unsupported data type ${this._dataType}`)
    }

    gl.bufferData(this._targetBufferType, bufferData, gl.STATIC_DRAW)
  }

  /**
   * Draws this buffer.
   */
  draw() {
    if (this._targetBufferType === gl.ARRAY_BUFFER) {
      gl.drawArrays(this._mode, 0, this._data.length / this._elementSize)
    } else if (this._targetBufferType === gl.ELEMENT_ARRAY_BUFFER) {
      gl.drawElements(this._mode, this._data.length, this._dataType, 0)
    }
  }

  private getTypeSize(type: number): number {
    switch (type) {
      case gl.FLOAT:
      case gl.INT:
      case gl.UNSIGNED_INT:
        return 4
      case gl.SHORT:
      case gl.UNSIGNED_SHORT:
        return 2
      case gl.BYTE:
      case gl.UNSIGNED_BYTE:
        return 1
      default:
        throw new Error(`Unsupported data type ${type}`)
    }
  }
}
