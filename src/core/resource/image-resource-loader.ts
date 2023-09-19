import { IResource, IResourceLoader } from '.'
import { ResourceManager } from './resource-manager'

export class ImageResource implements IResource {
  readonly name: string
  readonly data: HTMLImageElement

  constructor(name: string, data: HTMLImageElement) {
    this.name = name
    this.data = data
  }

  get width() {
    return this.data.width
  }
  get height() {
    return this.data.height
  }
}

export class ImageResourceLoader implements IResourceLoader {
  get supportedExtensions() {
    return ['png', 'gif', 'jpg']
  }

  loadResource(name: string) {
    const image = new Image()
    image.onload = () => this.onImageLoaded(name, image)
    image.src = name
  }

  private onImageLoaded(name: string, image: HTMLImageElement) {
    console.log('onImageLoaded: ', name, image)
    const resource = new ImageResource(name, image)
    ResourceManager.onResourceLoaded(resource)
  }
}
