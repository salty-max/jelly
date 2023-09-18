import { AttributeInfo } from './attribute'
import { gl } from './gl'

/**
 * Encapsulates a WebGL buffer, providing utility for setting up and manipulating graphics data.
 * @class
 */
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
   * Initializes a new WebGL buffer.
   * @param elementSize - The number of components per vertex attribute.
   * @param dataType - The data type of elements for the buffer (default: gl.FLOAT).
   * @param targetBufferType - Specifies the buffer type (default: gl.ARRAY_BUFFER).
   * @param mode - Defines the rendering primitive mode (default: gl.TRIANGLES).
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

  /** Deletes this buffer from the GPU memory. */
  destroy() {
    gl.deleteBuffer(this._buffer)
  }

  /**
   * Binds this buffer, enabling it for use in subsequent WebGL calls.
   * @param is_normalized - Indicates whether the data should be normalized (default: false).
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

  /** Detaches this buffer from the current WebGL context. */
  unbind() {
    for (const a of this.attributes) {
      gl.disableVertexAttribArray(a.location)
    }

    gl.bindBuffer(this._targetBufferType, null)
  }

  /**
   * Appends an attribute specification to this buffer.
   * @param info - The attribute specification to add.
   */
  addAttributeLocation(info: AttributeInfo) {
    this._hasAttribLocation = true
    this.attributes.push(info)
  }

  /**
   * Appends data to this buffer's data store.
   * @param data - The array of data elements to append.
   */
  pushBackData(data: number[]) {
    this._data.push(...data)
  }

  /** Uploads the buffer's data to the GPU for rendering. */
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

  /** Renders the content of the buffer. */
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
