/* eslint-disable no-param-reassign */
/* eslint-disable no-promise-executor-return */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-return-assign, class-methods-use-this */

import { $id, $type, $motion } from '../../utils/symbol'
import MotionValueEvent from './motion_event'
import defineHidden from '../../utils/define_hidden'
import createUniqueId from '../../utils/create_unique_id'
import isMotionValue from './is_motion_value'
import clamp from '../../utils/clamp'
import { easing } from '../../tween'
import driver from '../frame-loop/driver'
import MotionAnimation from './motion_animation'
import { motionFinished, motionRunning, setMotionStatus } from './moition_status'
import interpolator from './interpolator'

export type AsyncResult<V extends any> = Promise<{
  value: V
}>

export class MotionValue<V = any> {
  // accessor
  private _value: V

  get = () => this._value

  set = (val: V) => {
    this._value = val
  }

  // events
  private events = new MotionValueEvent<V>()

  on = this.events.on

  notify = this.events.notify

  clear = this.events.clear

  constructor(public initial: V) {
    this._value = this.initial

    setMotionStatus(this, 'idle')
  }

  // animation ?作用暂时不明,可能与 anime.js 的 animations 差不多
  private animation: null | MotionAnimation = null

  // animate tick
  private _update = (t: number) => {
    if (!motionRunning(this)) return false

    const animation = this.animation!

    if (!animation.time) animation.onStart(t, this)

    const { duration, ease, from, to } = animation

    let elapsed = t - animation.time

    elapsed = clamp(elapsed, 0, duration) / duration

    const current = interpolator(ease(elapsed), [0, 1], [from, to])

    animation.onUpdate(current, this)

    if (elapsed === 1) animation.onComplete(this)

    return elapsed < 1
  }

  private _start(target: any, resolve: VoidFunction) {
    setMotionStatus(this, 'running')

    const original = this.get() as any

    const duration = 1000 // interpolator(original, [this.initial as any, target], [1000, 0])
    // console.log('real duration', interpolator(original, [this.initial as any, target], [1000, 0]))

    const ease = easing.linear

    this.animation && this.animation.onStop(this)

    this.animation = new MotionAnimation({
      original,
      target,
      duration,
      ease,
      resolve,
    })

    // 需要保证 animation 的 唯一
    // 避免在 animation 时多调用

    driver.start(this._update)
  }

  // 取消 animate
  cancel = () => {
    setMotionStatus(this, 'idle')

    this.notify('onCancel')

    driver.cancel(this._update)
  }

  pause = () => {
    setMotionStatus(this, 'paused')
  }

  stop = () => {
    setMotionStatus(this, 'idle')

    this.notify('onStop')

    // destroy
    driver.cancel(this._update)
    this.animation = null
  }

  // playback control
  start = (target: V) => {
    // 解析 value 与 target 为 [from, to]
    return new Promise<void>((resolve) => {
      if (motionFinished(this)) return resolve()

      this._start(target, resolve)
    })
  }
}

// 2023/4/7 现在需要参考 useSpringValue 的实现。
// 每一个 motionValue 都会有自己的 playControl

const uniqueId = createUniqueId(0)

export function motionValue<V>(initial: V | MotionValue<V>) {
  if (isMotionValue(initial)) return initial

  const value = new MotionValue(initial)
  // 唯一标识
  defineHidden(value, $id, uniqueId())
  // 判断类型
  defineHidden(value, $type, $motion)

  return value
}
