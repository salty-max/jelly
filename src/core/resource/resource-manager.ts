import { IResource, IResourceLoader } from '.'
import { Message } from '../message/message'
import { ImageResourceLoader } from './image-resource-loader'
import { JsonResourceLoader } from './json-resource-loader'

export const MESSAGE_RESOURCE_LOADER_RESOURCE_LOADED =
  'MESSAGE_RESOURCE_LOADER_RESOURCE_LOADED::'

export class ResourceManager {
  private static _loaders: IResourceLoader[] = []
  private static _loadedResources: Record<string, IResource> = {}

  private constructor() {}

  static init() {
    this._loaders.push(new ImageResourceLoader())
    this._loaders.push(new JsonResourceLoader())
  }

  static registerLoader(loader: IResourceLoader) {
    this._loaders.push(loader)
  }

  static onResourceLoaded(resource: IResource) {
    this._loadedResources[resource.name] = resource
    Message.send(
      MESSAGE_RESOURCE_LOADER_RESOURCE_LOADED + resource.name,
      this,
      resource,
    )
  }

  static loadResource(name: string) {
    const ext = name.split('.').pop()?.toLowerCase()
    if (!ext) {
      console.error(`Resource name ${name} is invalid.`)
      return
    }

    for (const l of this._loaders) {
      if (l.supportedExtensions.includes(ext)) {
        l.loadResource(name)
        return
      }
    }

    console.warn(`No loader found for resource ${name}.`)
  }

  static isResourceLoaded(name: string) {
    return !!this._loadedResources[name]
  }

  static getResource(name: string): IResource | undefined {
    if (this.isResourceLoaded(name)) {
      return this._loadedResources[name]
    } else {
      this.loadResource(name)
    }
    return undefined
  }
}
