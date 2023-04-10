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
import { easings } from '../../tween'
import driver from '../frame-loop/driver'
import MotionAnimation from './motion_animation'
import { getMotionStatus, motionRunning, setMotionStatus } from './motion_status'
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

  get status() {
    return getMotionStatus(this)
  }

  // animation ?作用暂时不明,可能与 anime.js 的 animations 差不多
  animation: null | MotionAnimation = null

  // animate tick
  private _update = (t: number) => {
    if (!motionRunning(this)) return false

    const animation = this.animation!

    // TODO 设置 original 原始值
    if (!animation.time) animation.onStart(t, this)

    const { duration, easing, from, to } = animation

    let elapsed = t - animation.time

    elapsed = clamp(elapsed, 0, duration) / duration

    const current = interpolator(easing(elapsed), [0, 1], [from, to])

    animation.onUpdate(current, this)

    // TODO 设置 target 原始值
    if (elapsed === 1) animation.onComplete(this)

    return elapsed < 1
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
    return new Promise<void>((resolve) => {
      // 解析 value 与 target 为 [from, to]
      setMotionStatus(this, 'running')

      const current = this.get() as any

      const duration = 1000

      // 取消上次未完成的 animation
      this.animation && driver.cancel(this._update)

      this.animation = new MotionAnimation({
        original: current,
        target,
        duration,
        easing: easings.linear,
        resolve,
      })

      // 需要保证 animation 的 唯一
      // 避免在 animation 时多调用

      driver.start(this._update)
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
