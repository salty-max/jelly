import { IMessageHandler } from '.'
import { Message } from './message'

export class MessageSubscriptionNode {
  message: Message
  handler: IMessageHandler

  constructor(message: Message, handler: IMessageHandler) {
    this.message = message
    this.handler = handler
  }
}
