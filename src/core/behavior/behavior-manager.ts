import { IBehavior, IBehaviorBuilder } from '.'

export class BehaviorManager {
  private static _registeredBuilders: Record<string, IBehaviorBuilder> = {}

  static registerBuilder(builder: IBehaviorBuilder) {
    BehaviorManager._registeredBuilders[builder.type] = builder
  }

  static extractBehavior(json: any): IBehavior {
    if (json.type !== undefined) {
      if (BehaviorManager._registeredBuilders[String(json.type)]) {
        const builder = BehaviorManager._registeredBuilders[String(json.type)]
        return builder.buildFromJson(json)
      }

      throw new Error(`Behavior type ${json.type} is not registered`)
    }

    throw new Error('Behavior type is undefined')
  }
}
