/* eslint-disable class-methods-use-this */
import MotionEvent from './event'
import { $id, $promise } from '../utils/symbol'
import defineHidden from '../utils/define_hidden'
import uniqueId from '../utils/unique_id'
import makeControlledPromise from '../utils/make_controlled_promise'
import { AnimatableValue } from '../animation/interface'

export class MotionValue<V extends AnimatableValue = AnimatableValue> {
  constructor(private _initial: V) {
    this._value = this._initial
  }

  [$promise] = makeControlledPromise()

  // events
  private _event = new MotionEvent<V>()

  on = this._event.on

  notify = this._event.notify

  // accessor
  private _value: V

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

export const isMotionValue = <V extends AnimatableValue>(
  obj: V | MotionValue<V>
): obj is MotionValue<V> => obj && obj[$id]
