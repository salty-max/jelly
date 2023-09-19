import { Shader } from '../../gl/shader'
import { IMessageHandler } from '../message'
import { Message } from '../message/message'
import { JsonResource } from '../resource/json-resource-loader'
import {
  MESSAGE_RESOURCE_LOADER_RESOURCE_LOADED,
  ResourceManager,
} from '../resource/resource-manager'
import { Zone } from './zone'

/**
 * Manages the zones in the game.
 */
export class ZoneManager implements IMessageHandler {
  private static _registeredZones: Record<number, string> = {}
  private static _activeZone: Zone | undefined
  private static _instance: ZoneManager

  private constructor() {}

  static init() {
    ZoneManager._instance = new ZoneManager()
    this._registeredZones[0] = '../../../zones/test-zone.json'
  }

  /**
   * Changes the active zone.
   * @param id The ID of the zone to change to.
   */
  static changeZone(id: number) {
    if (this._activeZone) {
      this._activeZone.onDeactivated()
      this._activeZone.unload()
      this._activeZone = undefined
    }

    const zone = this._registeredZones[id]
    if (zone) {
      if (ResourceManager.isResourceLoaded(zone)) {
        const resource = ResourceManager.getResource(zone) as JsonResource
        this.loadZone(resource)
      } else {
        Message.subscribe(
          MESSAGE_RESOURCE_LOADER_RESOURCE_LOADED + zone,
          this._instance,
        )
        ResourceManager.loadResource(zone)
      }
    } else {
      throw new Error(`Zone ${id} not found.`)
    }
  }

  /**
   * Updates the active zone.
   * @param time The time since the last update in milliseconds.
   */
  static update(time: number) {
    if (this._activeZone) {
      this._activeZone.update(time)
    }
  }

  /**
   * Draws the active zone.
   * @param shader The shader to use for drawing.
   */
  static draw(shader: Shader) {
    if (this._activeZone) {
      this._activeZone.draw(shader)
    }
  }

  onMessage(message: Message): void {
    if (message.code.includes(MESSAGE_RESOURCE_LOADER_RESOURCE_LOADED)) {
      const resource = message.context as JsonResource
      ZoneManager.loadZone(resource)
    }
  }

  private static loadZone(resource: JsonResource) {
    const zoneData = resource.data
    let zoneId = zoneData.id
    if (zoneId === undefined) {
      throw new Error('Zone file format exception: Zone ID not present.')
    } else {
      zoneId = Number(zoneId)
    }
    let zoneName = zoneData.name
    if (zoneName === undefined) {
      throw new Error('Zone file format exception: Zone name not present.')
    } else {
      zoneName = String(zoneName)
    }

    let zoneDescription = zoneData.description
    if (zoneDescription) {
      zoneDescription = String(zoneDescription)
    }

    this._activeZone = new Zone(zoneId, zoneName, zoneDescription)
    this._activeZone.init(zoneData)
    this._activeZone.onActivated()
    this._activeZone.load()
  }
}
