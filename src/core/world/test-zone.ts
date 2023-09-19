import { Shader } from '../../gl/shader'
import { Sprite } from '../../graphics/sprite'
import { Zone } from './zone'

export class TestZone extends Zone {
  private _sprite!: Sprite

  load() {
    // Load
    this._sprite = new Sprite('test', 'firefox')
    this._sprite.load()
    super.load()
  }

  draw(shader: Shader) {
    this._sprite.draw(shader)
    super.draw(shader)
  }
}
