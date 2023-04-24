/* eslint-disable class-methods-use-this */
import MotionEvent from './event'
import { $id } from '../utils/symbol'
import defineHidden from '../utils/define_hidden'
import uniqueId from '../utils/unique_id'

export class MotionValue<V = any> {
  constructor(private _initial: V) {
    this._value = this._initial
  }

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

export function motionValue<V>(initial: V | MotionValue<V>) {
  if (isMotionValue(initial)) return initial

  const value = new MotionValue(initial)

  // 唯一标识
  defineHidden(value, $id, uniqueId('motion-'))

  return value
}

export function isMotionValue<V>(obj: V | MotionValue<V>): obj is MotionValue<V> {
  return obj && obj[$id]
}
