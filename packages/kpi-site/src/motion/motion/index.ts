/* eslint-disable max-classes-per-file, class-methods-use-this */

import { $id, $type, motionValueSymbol } from '../utils/symbol'
import MotionValueEvent from './motion_event'
import defineHidden from '../utils/define_hidden'
import createUniqueId from '../utils/create_unique_id'

export type StartAnimation = (onComplete: () => void) => any
export type MotionAnimation = any

export class MotionValue<V = any> {
  private value: V

  get = () => this.value

  set = (value: V) => {
    this.value = value
  }

  constructor(private initial: V) {
    this.value = this.initial
  }

  events = new MotionValueEvent<V>()

  on: MotionValueEvent<V>['on'] = (type, handler) => {
    const unsubscribe = this.events.on(type, handler)

    if (type !== 'update') return unsubscribe

    // sync animation frame
    // stop animation
    return unsubscribe
  }

  clear = () => {
    this.events.clear()
  }
}

export function isMotionValue<V>(obj: V | MotionValue<V>): obj is MotionValue<V> {
  return obj && obj[$type] === motionValueSymbol
}

const uniqueId = createUniqueId(0)

export function motionValue<V>(initial: V | MotionValue<V>) {
  if (isMotionValue(initial)) return initial

  const value = new MotionValue(initial)

  // 唯一标识
  defineHidden(value, $id, uniqueId())
  // 判断类型
  defineHidden(value, $type, motionValueSymbol)

  return new MotionValue(initial)
}
