/* eslint-disable class-methods-use-this */
import { isArray, isFunction, isString, noop } from '@kpi/shared'
import easing from '../tween/easing'
import cubicBezier from '../tween/cubic_bezier'

import type { MotionValue } from '../motion'
import type { MotionValueEventCallbacks } from '../motion/motion_event'
import type { Easing } from '../tween/interface'
import raf from '../utils/raf'

// function getAnimateEasing(ease: Transition['ease']) {
//   if (isFunction(ease)) return ease

//   if (isArray(ease) && ease.length === 4) return cubicBezier(...ease)

//   if (isString(ease) && easing[ease]) return easing[ease]

//   return easing.linear
// }

export type ResolvedValueTarget = string | number
export interface Transition {
  ease?: Easing
  delay?: number
  duration?: number
  autoplay?: boolean
}

export interface AnimationOptions extends Transition, MotionValueEventCallbacks {}

export interface MotionAnimation {
  time: number
  speed: number

  duration: number

  stop: () => void
  play: () => void
  pause: () => void
  complete: () => void
  cancel: () => void
  then: (onfulfilled: VoidFunction, onrejected?: VoidFunction) => Promise<void>
}

// 'object' | 'attribute' | 'transform' | 'css'
type AnimationType = any

export class MotionAnimation {}

export function motionAnimation<V = any>(
  value: MotionValue<V>,
  unResolvedTarget: any,
  options: AnimationOptions = {}
): MotionAnimation {
  let resolvePromise: VoidFunction
  let promise: Promise<void>

  const makePromise = () => {
    resolvePromise && resolvePromise()
    promise = new Promise((resolve) => {
      resolvePromise = resolve
    })
  }

  makePromise()
  //  resolve target
  // ...

  // return {
  //   type: 'animationType',
  //   easing: getAnimateEasing(options.ease),
  //   from: value.get(),
  //   to: unResolvedTarget,
  //   unit: 'px',
  //   test: () => true,
  //   parse: parseFloat,
  //   transform: (v) => `${v}px`,
  // }

  let state: AnimationPlayState = 'idle'

  // const ease = getAnimateEasing(options.ease)

  const target = unResolvedTarget

  let time = 0
  let speed = 1
  const duration = 300

  let stopRaf = noop

  const finish = () => {}

  const tick = (t: number) => {
    const finished = state === 'finished'

    options.update?.(value.get())
    finished && finish()

    console.log(finished)
    return !finished
  }

  const control = {
    get time() {
      return time
    },
    set time(t: number) {
      time = t
    },
    get speed() {
      return speed
    },
    set speed(newSpeed: number) {
      speed = newSpeed
    },
    get duration() {
      return duration
    },
    get state() {
      return state
    },
    play: () => {
      stopRaf = raf(tick)
    },
    pause: () => {
      state = 'paused'
      options.pause?.()
    },
    stop: () => {
      state = 'idle'
    },
    cancel: () => {
      state = 'idle'
      // stop raf
      stopRaf()
      makePromise()
      // updatePromise
      // startTime = cancelTime = null
    },
    complete: () => {
      state = 'finished'
      options.complete?.()
    },
    then(onfulfilled, onrejected) {
      return promise.then(onfulfilled, onrejected)
    },
  }

  return control
}
