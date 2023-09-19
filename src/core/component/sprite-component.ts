import { IComponent, IComponentBuilder, IComponentData } from '.'
import { Shader } from '../../gl/shader'
import { Sprite } from '../../graphics/sprite'
import { Component } from './component'

export class SpriteComponent extends Component {
  private _sprite: Sprite

  constructor(data: SpriteComponentData) {
    super(data)
    this._sprite = new Sprite(data.name, data.materialName)
  }

  load() {
    this._sprite.load()
  }

  update(time: number) {
    this._sprite.update(time)
  }

  draw(shader: Shader) {
    this._sprite.draw(shader, this.owner.worldMatrix)
    super.draw(shader)
  }
}

export class SpriteComponentData implements IComponentData {
  name: string | undefined
  materialName!: string

  setFromJson(json: any) {
    if (json.name !== undefined) {
      this.name = String(json.name)
    }

    if (json.materialName !== undefined) {
      this.materialName = String(json.materialName)
    } else {
      throw new Error('Sprite is missing materialName property')
    }
  }
}

export class SpriteComponentBuilder implements IComponentBuilder {
  get type(): string {
    return 'sprite'
  }

  buildFromJson(json: any): IComponent {
    const data = new SpriteComponentData()
    data.setFromJson(json)
    return new SpriteComponent(data)
  }
}
