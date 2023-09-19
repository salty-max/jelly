import { Shader } from '../../gl/shader'
import { TestZone } from './test-zone'
import { Zone } from './zone'

export class ZoneManager {
  private static _globalZoneID = -1
  private static _zones: Record<number, Zone> = {}
  private static _activeZone: Zone

  private constructor() {}

  static createZone(name: string, description?: string): number {
    this._globalZoneID++
    const zone = new Zone(this._globalZoneID, name, description)
    this._zones[this._globalZoneID] = zone
    return this._globalZoneID
  }

  // TODO: Remove this
  static createTestZone() {
    this._globalZoneID++
    const zone = new TestZone(this._globalZoneID, 'test', 'A test zone')
    this._zones[this._globalZoneID] = zone
    return this._globalZoneID
  }

  static changeZone(id: number) {
    if (this._activeZone) {
      this._activeZone.onDeactivated()
      this._activeZone.unload()
    }

    const zone = this._zones[id]
    if (!zone) {
      console.warn(`Cannot change to zone ${id}. Zone not found.`)
      return
    }

    this._activeZone = zone
    this._activeZone.onActivated()
    this._activeZone.load()
  }

  static update(time: number) {
    if (this._activeZone) {
      this._activeZone.update(time)
    }
  }

  static draw(shader: Shader) {
    if (this._activeZone) {
      this._activeZone.draw(shader)
    }
  }
}
