/* eslint-disable no-param-reassign */
/* eslint-disable no-promise-executor-return */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-return-assign, class-methods-use-this */

import { $event, $id, $motion, $status } from '../../utils/symbol'
import { defineGetter, defineHidden, defineReadonly } from '../../utils/define_property'
import createUniqueId from '../../utils/create_unique_id'
import isMotionValue from './is_motion_value'
import clamp from '../../utils/clamp'
import { easings } from '../../tween'
import driver from '../../frame-loop'
import MotionAnimation from './motion_animation'
import interpolator from './interpolator'
import MotionEvent from './motion_event'
import MotionStatus from './motion_status'
import { PlaybackControl } from '../playback_control'

export type AsyncResult<V extends any> = Promise<{
  value: V
}>

export interface MotionValueEventCallbacks<V = any> {
  onStart?: VoidFunction
  onUpdate?: (current: V) => void
  onPause?: VoidFunction
  onCancel?: VoidFunction
  onStop?: VoidFunction
  onComplete?: VoidFunction
}

export type MotionValueEventName<V = any> = keyof MotionValueEventCallbacks<V>
export type MotionValueEventHandler<N extends MotionValueEventName> = MotionValueEventCallbacks[N]

export class MotionValue<V = any> {
  private [$event] = new MotionEvent<V>()

  on = this[$event].on

  private [$status] = new MotionStatus()

  get status() {
    return this[$status].status
  }

  value: V

  constructor(private initial: V) {
    this.value = this.initial
  }

  // // accessor

  get = () => this.value

  set = (value: V) => {
    this.value = value
  }

  // private _value: V
  // get = () => this._value
  // set = (val: V) => (this._value = val)
  // get notify() {
  //   return this[$event].notify
  // }
  // constructor(public initial: V) {
  //   this._value = this.initial
  // }
  // private [$status] = new MotionStatus()
  // // animation ?作用暂时不明,可能与 anime.js 的 animations 差不多
  // animation: null | MotionAnimation = null
  // // playback control
  // // animate tick
  // private _update = (t: number) => {
  //   if (!this[$status].running) return false
  //   const animation = this.animation!
  //   const { duration, easing, from, to } = animation
  //   if (animation.resume) {
  //     animation.startTime = t
  //     animation.resume = false
  //     return true
  //   }
  //   // TODO 设置 original 原始值
  //   if (!animation.startTime) animation.onStart(t, this)
  //   let elapsed = t - animation.startTime + animation.lastTime
  //   elapsed = clamp(elapsed, 0, duration) / duration
  //   const current = interpolator(easing(elapsed), [0, 1], [from, to])
  //   animation.onUpdate(current, this, t)
  //   this[$event].notify('change', current)
  //   // TODO 设置 target 原始值
  //   if (elapsed === 1) animation.onComplete(this)
  //   return elapsed < 1
  // }
  // // 取消 animate
  // cancel = () => {
  //   this[$status].status = 'idle'
  //   // motionNotify(this, 'onCancel')
  //   driver.cancel(this._update)
  // }
  // pause = () => {
  //   this[$status].status = 'paused'
  //   driver.cancel(this._update)
  // }
  // resume = () => {
  //   if (!this[$status].paused) return
  //   this[$status].status = 'running'
  //   if (this.animation) {
  //     this.animation.resume = true
  //     this.animation.lastTime = this.animation.currentTime
  //     this.animation.startTime = 0
  //   }
  //   driver.start(this._update)
  // }
  // stop = () => {
  //   this[$status].status = 'idle'
  //   // motionNotify(this, 'onStop')
  //   // destroy
  //   driver.cancel(this._update)
  //   this.animation = null
  // }
  // start = (target: V) => {
  //   return new Promise<void>((resolve) => {
  //     // 解析 value 与 target 为 [from, to]
  //     this[$status].status = 'running'
  //     const current = this.get() as any
  //     const duration = 1000
  //     // 取消上次未完成的 animation
  //     this.animation && driver.cancel(this._update)
  //     this.animation = new MotionAnimation({
  //       original: current,
  //       target,
  //       duration,
  //       easing: easings.easeInBack,
  //       resolve,
  //     })
  //     // 需要保证 animation 的 唯一
  //     // 避免在 animation 时多调用
  //     driver.start(this._update)
  //   })
  // }
}

// 2023/4/7 现在需要参考 useSpringValue 的实现。
// 每一个 motionValue 都会有自己的 playControl

const uniqueId = createUniqueId(0)

// 暴露给外部，使用闭包精简一些属性
export function motionValue<V>(initial: V | MotionValue<V>) {
  if (isMotionValue(initial)) return initial

  const value = new MotionValue(initial)

  // 唯一标识
  defineHidden(value, $id, uniqueId())
  // 类型判断
  defineHidden(value, $motion, true)

  return value
}
