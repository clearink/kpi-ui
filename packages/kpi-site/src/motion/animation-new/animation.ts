/* eslint-disable class-methods-use-this */
import { noop } from '@kpi/shared'

import type { MotionValue } from './motion'
import type { MotionValueEventCallbacks } from './motion/motion_event'
import type { Easing } from '../tween/interface'
import raf from '../utils/raf'
import MotionValueEvent from './motion/motion_event'
import clamp from '../utils/clamp'

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

// 创建 anime.js 中的  animations 对象, 动画的调度是在 playbackControl 实现的
export function motionAnimation<V = any>(
  value: MotionValue<V>,
  unResolvedTarget: any,
  options: AnimationOptions = {}
): MotionAnimation {
  const finishedPromise = createFinishedPromise()

  finishedPromise.update()

  // const target = resolvedTarget(value.get(), unResolvedTarget)
  const target = unResolvedTarget

  const from = value.get()
  const color = 'rgba(255, 255, 255, 1)'
  const numbers = (color.match(regexNumber) || [0]).map(Number)
  const strings = color.split(regexNumber)

  let state: AnimationPlayState = 'idle'

  // const ease = getAnimateEasing(options.ease)

  let startTime = 0
  const lastTime = 0
  let now = 0

  const speed = 1

  // timings
  const duration = 300
  const delay = 0
  const endDelay = 0
  let progress = 0

  const finish = () => {}

  const setMotionProgress = (t: number): boolean => {
    const currentTime = t
    // 进度
    progress = clamp(currentTime / duration, 0, 1) * 100

    // set current value
    // value.set()

    // notify event
    value.notify('update', value.get())

    return true
  }

  const tick = (t: number) => {
    now = t

    if (!startTime) startTime = now

    return setMotionProgress((now + (lastTime - startTime)) * speed)
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
      finishedPromise.update()
      // updatePromise
      // startTime = cancelTime = null
    },
    complete: () => {
      state = 'finished'
      options.complete?.()
    },
    then(onfulfilled, onrejected) {
      return finishedPromise.get().then(onfulfilled, onrejected)
    },
  }
}
