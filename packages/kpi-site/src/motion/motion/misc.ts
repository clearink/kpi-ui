/* eslint-disable max-classes-per-file */
import SubscriptionManager from '../utils/subscription_manager'

import type { MotionValueEventHandler, MotionValueEventName } from './interface'

export class MotionEvent<V = any> {
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

export class MotionAccessor<V> {
  private _value: V

  constructor(private _initial: V) {
    this._value = this._initial
  }

  get value() {
    return this._value
  }

  set value(value: V) {
    this._value = value
  }
}

export class MotionStatus {
  private _status: AnimationPlayState = 'idle'

  private _animated = false

  get status() {
    return this._status
  }

  set status(status: typeof this._status) {
    this._status = status
  }

  get running() {
    return this.status === 'running'
  }

  get paused() {
    return this._status === 'paused'
  }

  get animated() {
    return this._animated
  }

  set animated(animated: boolean) {
    this._animated = animated
  }
}
