import { defineGetter, defineHidden } from '../utils/define'
import { $id } from '../utils/symbol'
import uniqueId from '../utils/unique_id'
import MotionEvent from './event'

export class MotionValue<V = any> {
  on!: MotionEvent<V>['on']

  notify!: MotionEvent<V>['notify']

  clear!: MotionEvent<V>['clear']

  get: () => V

  set: (val: V) => void

  constructor(initial: V) {
    let $value = initial

    const event = new MotionEvent<V>()

    defineGetter(this, 'on', () => event.on)

    defineGetter(this, 'notify', () => event.notify)

    defineGetter(this, 'clear', () => event.clear)

    this.get = () => $value

    this.set = (value) => {
      $value = value
    }
  }
}

export function motionValue<V = any>(initial: V | MotionValue<V>): MotionValue<V> {
  if (isMotionValue(initial)) return initial

  const value = new MotionValue(initial)

  // 唯一标识
  defineHidden(value, $id, uniqueId('motion-'))

  return value as MotionValue<V>
}

export function isMotionValue(obj: any): obj is MotionValue {
  return Boolean(obj && obj[$id])
}
