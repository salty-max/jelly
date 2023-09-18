import { IMessageHandler } from '.'
import { Message, MessagePriority } from './message'
import { MessageSubscriptionNode } from './message-subcription-node'

export class MessageBus {
  private static _subscriptions: Record<string, IMessageHandler[]> = {}
  private static _normalQueueMessagePerUpdate: number = 10
  private static _normalMessageQueue: MessageSubscriptionNode[] = []

  private constructor() {}

  static addSubscription(code: string, handler: IMessageHandler) {
    if (this._subscriptions[code]) {
      this._subscriptions[code] = []
    }

    if (this._subscriptions[code].indexOf(handler) !== -1) {
      console.warn(
        `Attempting to add a duplicate handler to code: ${code}. Subscription not added.`,
      )
    } else {
      this._subscriptions[code].push(handler)
    }
  }

  static removeSubscription(code: string, handler: IMessageHandler) {
    if (!this._subscriptions[code]) {
      console.warn(
        `Cannot unsubscribe handler from code: ${code}. That code is not subscribed to.`,
      )
      return
    }

    const nodeIndex = this._subscriptions[code].indexOf(handler)

    if (nodeIndex !== -1) {
      this._subscriptions[code].splice(nodeIndex, 1)
    }
  }

  static post(message: Message) {
    console.log('Message posted: ', message.code)
    const handlers = this._subscriptions[message.code]
    if (!handlers) {
      return
    }

    for (const h of handlers) {
      if (message.priority === MessagePriority.HIGH) {
        h.onMessage(message)
      } else {
        this._normalMessageQueue.push(new MessageSubscriptionNode(message, h))
      }
    }
  }

  static update() {
    if (this._normalMessageQueue.length === 0) {
      return
    }

    const messageLimit = Math.min(
      this._normalQueueMessagePerUpdate,
      this._normalMessageQueue.length,
    )

    for (let i = 0; i < messageLimit; i++) {
      const node = this._normalMessageQueue.shift()
      if (node) {
        node.handler.onMessage(node.message)
      }
    }
  }
}
