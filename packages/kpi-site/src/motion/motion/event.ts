import SubscriptionManager from '../utils/subscription_manager'

import type { MotionValueEventHandler, MotionValueEventName } from './interface'

export default class MotionEvent<V = any> {
  private _event = new Map<string, SubscriptionManager>()

  on = <T extends MotionValueEventName>(type: T, handler: MotionValueEventHandler<V, T>) => {
    const event = this._event

    if (!event.has(type)) event.set(type, new SubscriptionManager())

    return event.get(type)!.add(handler)
  }

  notify = <T extends MotionValueEventName<V>>(
    type: T,
    ...args: Parameters<NonNullable<MotionValueEventHandler<V, T>>>
  ) => {
    const event = this._event.get(type)
    event && event.notify(...args)
  }

  clear = () => this._event.clear()
}
