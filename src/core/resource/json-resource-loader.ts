import { IResource, IResourceLoader } from '.'
import { ResourceManager } from './resource-manager'

export class JsonResource implements IResource {
  readonly name: string
  readonly data: any

  constructor(name: string, data: any) {
    this.name = name
    this.data = data
  }
}

export class JsonResourceLoader implements IResourceLoader {
  get supportedExtensions() {
    return ['json']
  }

  loadResource(name: string) {
    fetch(name)
      .then((response) => response.json())
      .then((data) => this.onJsonLoaded(name, data))
  }

  private onJsonLoaded(name: string, data: any) {
    console.log('onJsonLoaded: ', name, data)
    const resource = new JsonResource(name, data)
    ResourceManager.onResourceLoaded(resource)
  }
}
