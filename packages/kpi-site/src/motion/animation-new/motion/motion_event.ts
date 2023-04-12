import { $event } from '../../utils/symbol'
import SubscriptionManager from '../../utils/subscription_manager'

export interface MotionValueEventCallbacks<V = any> {
  start?: VoidFunction
  change?: (current: V) => void
  pause?: VoidFunction
  cancel?: VoidFunction
  stop?: VoidFunction
  finish?: VoidFunction
}

export type MotionValueEventName<V = any> = keyof MotionValueEventCallbacks<V>
export type MotionValueEventHandler<N extends MotionValueEventName> = MotionValueEventCallbacks[N]

export default class MotionEvent<V = any> {
  private _event = new Map<string, SubscriptionManager>()

  on = <T extends MotionValueEventName>(type: T, handler: MotionValueEventHandler<T>) => {
    const event = this._event

    if (!event.has(type)) event.set(type, new SubscriptionManager())

    return event.get(type)!.add(handler)
  }

  notify = <T extends MotionValueEventName<V>>(type: T, ...args: any) => {
    const event = this._event.get(type)
    event && event.notify(...args)
  }

  clear = () => this._event.clear()
}
