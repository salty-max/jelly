class Engine {
  private _count: number = 0

  constructor() {
    this._count = 0
  }

  start() {
    this.loop()
  }

  loop() {
    this._count++
    console.log(this._count)
    requestAnimationFrame(this.loop.bind(this))
  }
}

export default Engine
