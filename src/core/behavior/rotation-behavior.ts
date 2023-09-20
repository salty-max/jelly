import { IBehavior, IBehaviorBuilder, IBehaviorData } from '.'
import { Vec3 } from '../math/vec3'
import { Behavior } from './behavior'

export class RotationBehavior extends Behavior {
  private _rotation: Vec3 = Vec3.zero

  constructor(data: RotationBehaviorData) {
    super(data)
    this._rotation = data.rotation
  }

  update(time: number): void {
    this.owner.transform.rotation.add(this._rotation)
    super.update(time)
  }
}

export class RotationBehaviorData implements IBehaviorData {
  name: string = ''
  rotation: Vec3 = Vec3.zero

  setFromJson(json: any): void {
    if (json.name === undefined) {
      throw new Error('Name must be defined in behavior data')
    }
    this.name = String(json.name)

    if (json.rotation !== undefined) {
      this.rotation.setFromJson(json.rotation)
    }
  }
}

export class RotationBehaviorBuilder implements IBehaviorBuilder {
  get type(): string {
    return 'rotation'
  }

  buildFromJson(json: any): IBehavior {
    const data = new RotationBehaviorData()
    data.setFromJson(json)
    return new RotationBehavior(data)
  }
}
