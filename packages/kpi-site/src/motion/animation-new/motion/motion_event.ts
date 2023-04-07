import SubscriptionManager from '../../utils/subscription_manager'

export interface MotionValueEventCallbacks<V = any> {
  onPlay?: VoidFunction
  onUpdate?: (current: V) => void
  onPause?: VoidFunction
  onCancel?: VoidFunction
  onStop?: VoidFunction
  onComplete?: VoidFunction
}

export type MotionValueEventName = keyof MotionValueEventCallbacks

export default class MotionValueEvent<V = any> {
  events = new Map<string, SubscriptionManager>()

  on = <T extends keyof MotionValueEventCallbacks<V>>(
    type: T,
    handler: MotionValueEventCallbacks<V>[T]
  ) => {
    if (!this.events.has(type)) this.events.set(type, new SubscriptionManager())

    return this.events.get(type)!.add(handler)
  }

  notify = (type: keyof MotionValueEventCallbacks<V>, ...args: any[]) => {
    const observer = this.events.get(type)
    observer && observer.notify(...args)
  }

  clear = () => this.events.clear()
}
