/* eslint-disable max-classes-per-file, class-methods-use-this */

import { pick } from '@kpi/shared'
import { $id, $type, motionValueSymbol } from '../../utils/symbol'
import MotionValueEvent from './motion_event'
import defineHidden from '../../utils/define_hidden'
import createUniqueId from '../../utils/create_unique_id'
import createFinishedPromise from '../../utils/create_finished_promise'

export interface MotionValue<V = any> extends Pick<MotionValueEvent<V>, 'on' | 'notify' | 'clear'> {
  get: () => V
  set: (value: V) => void
}

export function isMotionValue<V>(obj: V | MotionValue<V>): obj is MotionValue<V> {
  return obj && obj[$type] === motionValueSymbol
}

const uniqueId = createUniqueId(0)

// motionValue 只是一个含有注册事件的对象而已
// 具体的 motion 实现是在 animation 中

// 2023/4/7 现在需要参考 useSpringValue 的实现。每一个 motionValue 都会有自己的 playControl
export function motionValue<V>(initial: V | MotionValue<V>) {
  if (isMotionValue(initial)) return initial

  const events = new MotionValueEvent()

  let current = initial

  const promise = createFinishedPromise()

  const value: MotionValue<V> = {
    // events
    ...pick(events, ['on', 'notify', 'clear']),

    // accessor
    get: () => current,
    set: (val: V) => {
      current = val
    },

    // thenable

    // interpolator
    // to: (input:[number,number]){}
  }

  // 唯一标识
  defineHidden(value, $id, uniqueId())
  // 判断类型
  defineHidden(value, $type, motionValueSymbol)

  return value
}
