import { SpriteComponent } from '../component/sprite-component'
import { Node } from './node'
import { Zone } from './zone'

export class TestZone extends Zone {
  private _parentNode!: Node
  private _testNode!: Node
  private _testSprite!: SpriteComponent

  load() {
    this._parentNode = new Node(0, 'Parent Node')
    this._parentNode.transform.position.x = 500
    this._parentNode.transform.position.y = 350

    this._testNode = new Node(1, 'Test Node')
    this._testSprite = new SpriteComponent('Test Sprite', 'firefox')
    this._testNode.addComponent(this._testSprite)
    this._testNode.transform.position.x = 120
    this._testNode.transform.position.y = 120

    this._parentNode.addChild(this._testNode)
    this.scene.addNode(this._parentNode)

    super.load()
  }

  update(time: number) {
    this._parentNode.transform.rotation.z += 0.01
    super.update(time)
  }
}
