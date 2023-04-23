import { finished, paused, running } from './utils/status'
import makeControlledPromise from '../utils/make_controlled_promise'
import driver from '../frame-loop'

import type { MotionAnimation } from './motion_animation'
import each from '../utils/each'

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

export function playbackControl(animations: MotionAnimation[]): PlaybackControl {
  const $status: AnimationPlayState = 'idle'
  const $animated = false
  const $promise = makeControlledPromise()

  $promise.update()

  let start = 0
  let $time = 0

  const $update = (t: number) => {
    if (!start) start = t
    $time = t - start
    each(animations, (animation) => {})
    return true
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
      return animations[animations.length - 1]?.end ?? 0
    },

    play: () => {
      if (paused($status)) return

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
