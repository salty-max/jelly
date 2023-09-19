import { Shader } from '../../gl/shader'
import { Sprite } from '../../graphics/sprite'
import { Component } from './component'

export class SpriteComponent extends Component {
  private _sprite: Sprite

  constructor(name: string, materialName: string) {
    super(name)
    this._sprite = new Sprite(name, materialName)
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
