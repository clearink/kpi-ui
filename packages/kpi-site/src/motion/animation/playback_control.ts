import { paused, running } from './utils/status'
import makeControlledPromise from '../utils/make_controlled_promise'
import driver from '../frame-loop'

import { MotionAnimation, shouldMotion } from './motion_animation'
import each from '../utils/each'
import interpolator from '../utils/interpolator'
import { MotionValue } from '../motion'
import { AnimatableValue } from './interface'
import clamp from '../utils/clamp'

// const run = (funcs: VoidFunction[]) => funcs.forEach((func) => isFunction(func) && func())

// const max = (list: number[]) => Math.max.apply(null, list)

// const sum = (list: number[]) => list.reduce((acc, cur) => acc + cur, 0)

// const transform = (numbers: number[], strings: string[]) => {
//   return strings.reduce((result, str, i) => {
//     const num = numbers[i] ?? ''
//     return `${result}${str}${num}`
//   }, '')
// }

// 负责调度 motion animations
// export default class PlaybackControl {
//   private [$animations]: MotionAnimation[] = []

//   private [$promise] = makeControlledPromise()

//   constructor(animations: MotionAnimation[]) {
//     this[$animations] = animations
//     this[$promise].update()
//   }

//   // status
//   private _status: AnimationPlayState = 'idle'

//   get status() {
//     return this._status
//   }

//   animated = false

//   // motion time
//   private _time!: number

//   // motion speed
//   speed = 1

//   // lasted animation end time
//   get duration() {
//     const len = this[$animations].length
//     return this[$animations][len - 1]?.end ?? 0
//   }

//   private _update = (t: number) => {
//     return true
//   }

//   play = () => {
//     if (running(this) || finished(this)) return

//     this.animated = true

//     this._status = 'running'

//     driver.start(this._update)
//   }

//   reset = () => {}

//   restart = () => {
//     this.reset()
//     this.play()
//   }

//   cancel = () => {
//     this._status = 'finished'
//     // 取消上一次的 promise 回调
//     this[$promise].update(true)

//     driver.cancel(this._update)
//   }

//   stop = () => {
//     this._status = 'idle'
//     driver.cancel(this._update)
//   }

//   pause = () => {
//     if (paused(this)) return

//     this._status = 'paused'
//     driver.cancel(this._update)
//   }

//   reverse = () => {}

//   finish = () => {
//     this._status = 'finished'
//   }

//   seek = () => {}

//   then(onfulfilled: VoidFunction, onrejected?: VoidFunction) {
//     return this[$promise].get().then(onfulfilled, onrejected)
//   }
// }

export interface PlaybackControl {
  readonly time: number

  readonly status: AnimationPlayState

  readonly animated: boolean

  readonly speed: number

  // lasted animation end time
  readonly duration: number

  play: VoidFunction

  reset: VoidFunction

  restart: VoidFunction

  cancel: VoidFunction

  stop: VoidFunction

  pause: VoidFunction

  reverse: VoidFunction

  finish: VoidFunction

  seek: VoidFunction

  then(onfulfilled: VoidFunction, onrejected?: VoidFunction): Promise<void>
}

export function playbackControl<V extends AnimatableValue>(
  motion: MotionValue<V>,
  animations: MotionAnimation[]
): PlaybackControl {
  const $duration = animations[animations.length - 1]?.end ?? 0

  const $promise = makeControlledPromise()
  $promise.update()

  // 是否运行动画过
  let $animated = false
  // 状态
  let $status: AnimationPlayState = 'idle'
  // 运动开始时间
  let $start = 0
  // 运动结束时间
  const $end = 0
  // 运动经过的时长
  let $time = 0

  const $update = (t: number) => {
    if (!running($status)) return false

    if (!$start) $start = t

    $animated = true

    $time = t + $end - $start

    each(animations, (animation) => {
      const { start, delay, duration, value } = animation

      if (!shouldMotion($time, animation)) return
      const elapsed = clamp($time - start - delay, 0, duration)
      // 如果在误差范围内, 可以进行 notify

      const current = interpolator(elapsed, [0, duration], value as any)
      console.log(current, elapsed, duration)
      if (Math.round(elapsed) === 0) {
        motion.notify('change', value[0] as any)
      } else if (Math.round(elapsed) >= duration) {
        motion.notify('change', value[1] as any)
      } else {
        motion.notify('change', current as any)
      }
    })

    return $time <= $duration
  }

  return {
    get time() {
      return $time
    },

    get status() {
      return $status
    },

    get animated() {
      return $animated
    },

    get speed() {
      return 1
    },

    get duration() {
      return $duration
    },

    play: () => {
      if (paused($status)) return

      $status = 'running'

      driver.start($update)
    },

    reset: () => {},

    restart: () => {},

    cancel: () => {},

    stop: () => {},

    pause: () => {},

    reverse: () => {},

    finish: () => {},

    seek: () => {},

    then(onfulfilled, onrejected) {
      return $promise.get().then(onfulfilled, onrejected)
    },
  }
}
