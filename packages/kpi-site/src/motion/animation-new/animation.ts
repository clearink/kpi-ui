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

// // 'object' | 'attribute' | 'transform' | 'css'
// type AnimationType = any

// 实现 anime.js 的 anime() 的返回值

const createFinishedPromise = () => {
  const expose = {} as { resolve: VoidFunction; promise: Promise<void> }

  const update = () => {
    expose.resolve?.()
    expose.promise = new Promise<void>((resolve) => {
      expose.resolve = resolve
    })
  }

  return { update, get: () => expose.promise }
}

// handles exponents notation
const regexNumber = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g

const transform = (numbers: number[], strings: string[]) => {
  return strings.reduce((result, str, i) => {
    const num = numbers[i] ?? ''
    return `${result}${str}${num}`
  }, '')
}
export function motionAnimation<V = any>(
  value: MotionValue<V>,
  unResolvedTarget: any,
  options: AnimationOptions = {}
): MotionAnimation {
  const promise = createFinishedPromise()

  promise.update()

  // TODO resolve target
  // ...

  // const target = resolvedTarget(value.get(), unResolvedTarget)
  const target = unResolvedTarget
  // '#000'=>'rgba(255,255,255,1)'
  // numbers: [255,255,255, 1]
  // strings: ['rgba(', ',' , ',' , ',' , ')']
  /* value => strings.reduce((result, str, i)=>{
    const num = numbers[i]
    return `${result}${str}${isNumber(num) ? num:''}`
  }, '')
  */

  const from = value.get()
  const color = 'rgba(255, 255, 255, 1)'
  const numbers = (color.match(regexNumber) || [0]).map(Number)
  const strings = color.split(regexNumber)

  let state: AnimationPlayState = 'idle'

  // const ease = getAnimateEasing(options.ease)

  let time = 0
  let speed = 1
  const duration = 300

  let stopRaf = noop

  const finish = () => {}

  const tick = (t: number) => {
    const finished = state === 'finished'

    options.update?.(value.get())
    finished && finish()

    return !finished
  }

  return {
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
      promise.update()
      // updatePromise
      // startTime = cancelTime = null
    },
    complete: () => {
      state = 'finished'
      options.complete?.()
    },
    then(onfulfilled, onrejected) {
      return promise.get().then(onfulfilled, onrejected)
    },
  }
}
