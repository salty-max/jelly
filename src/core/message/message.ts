import { IMessageHandler } from '.'
import { MessageBus } from './message-bus'

export enum MessagePriority {
  NORMAL,
  HIGH,
}

export class Message {
  code: string
  context: any
  sender: any
  priority: MessagePriority

  constructor(
    code: string,
    sender: any,
    context?: any,
    priority: MessagePriority = MessagePriority.NORMAL,
  ) {
    this.code = code
    this.sender = sender
    this.context = context
    this.priority = priority
  }

  static send(code: string, sender: any, context?: any) {
    MessageBus.post(new Message(code, sender, context, MessagePriority.NORMAL))
  }

  static sendPriority(code: string, sender: any, context?: any) {
    MessageBus.post(new Message(code, sender, context, MessagePriority.HIGH))
  }

  static subscribe(code: string, handler: IMessageHandler) {
    MessageBus.addSubscription(code, handler)
  }

  static unsubscribe(code: string, handler: IMessageHandler) {
    MessageBus.removeSubscription(code, handler)
  }
}
