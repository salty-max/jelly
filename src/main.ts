import { Engine } from './core/engine'

const engine = new Engine()

window.onload = () => {
  engine.start()
}

window.onresize = () => {
  engine.resize()
}
