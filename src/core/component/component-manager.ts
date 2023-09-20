import { IComponent, IComponentBuilder } from '.'

export class ComponentManager {
  private static _registeredBuilders: Record<string, IComponentBuilder> = {}

  static registerBuilder(builder: IComponentBuilder) {
    ComponentManager._registeredBuilders[builder.type] = builder
  }

  static extractComponent(json: any): IComponent {
    if (json.type !== undefined) {
      if (ComponentManager._registeredBuilders[String(json.type)]) {
        const builder = ComponentManager._registeredBuilders[String(json.type)]
        return builder.buildFromJson(json)
      }

      throw new Error(`Component type ${json.type} is not registered`)
    }

    throw new Error('Component type is undefined')
  }
}
