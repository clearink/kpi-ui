import { AnimatableValue } from '../animation/interface'
import defineHidden from '../utils/define_hidden'
import { $id } from '../utils/symbol'
import uniqueId from '../utils/unique_id'
import MotionEvent from './event'

export class MotionValue<V extends AnimatableValue = AnimatableValue> {
  on: MotionEvent<V>['on']

  notify: MotionEvent<V>['notify']

  constructor(private _value: V) {
    const event = new MotionEvent<V>()
    this.on = event.on
    this.notify = event.notify
  }

  get = () => {
    return this._value
  }

  set = (value: V) => {
    this._value = value
  }
}

export function motionValue<V extends AnimatableValue>(initial: V | MotionValue<V>) {
  if (isMotionValue(initial)) return initial

  const value = new MotionValue(initial)

  // 唯一标识
  defineHidden(value, $id, uniqueId('motion-'))

  return value
}

export function isMotionValue<V extends AnimatableValue>(
  obj: V | MotionValue<V>
): obj is MotionValue<V> {
  return obj && obj[$id]
}
