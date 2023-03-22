import SubscriptionManager from '../utils/subscription_manager'

export interface MotionValueEventCallbacks<V> {
  start: () => void
  complete: () => void
  cancel: () => void
  update: (latestValue: V) => void
}

export default class MotionValueEvent<V = any> {
  events = new Map<string, SubscriptionManager>()

  on = <T extends keyof MotionValueEventCallbacks<V>>(
    type: T,
    handler: MotionValueEventCallbacks<V>[T]
  ) => {
    if (!this.events.has(type)) this.events.set(type, new SubscriptionManager())

    return this.events.get(type)!.add(handler)
  }

  notify = (type: keyof MotionValueEventCallbacks<V>) => {
    const observer = this.events.get(type)
    observer && observer.notify()
  }

  clear = () => this.events.clear()
}
