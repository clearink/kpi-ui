import defineHidden from '../utils/define_hidden'
import { $id } from '../utils/symbol'
import uniqueId from '../utils/unique_id'
import MotionEvent from './event'

export class MotionValue<V = any> {
  on: MotionEvent<V>['on']

  notify: MotionEvent<V>['notify']

  constructor(private _initial: V) {
    this._value = this._initial

    const event = new MotionEvent<V>()
    this.on = event.on
    this.notify = event.notify
  }

  private _value: V

  get = () => {
    return this._value
  }

  set = (value: V) => {
    this._value = value
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
  return obj && obj[$id]
}
