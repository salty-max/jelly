export interface IResource {
  readonly name: string
  readonly data: any
}

export interface IResourceLoader {
  readonly supportedExtensions: string[]
  loadResource(name: string): void
}
