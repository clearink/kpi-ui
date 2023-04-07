/* eslint-disable no-param-reassign */

import { isFunction, isArray, isString } from '@kpi/shared'
import { easing, cubicBezier } from '../tween'

import raf from '../utils/raf'
import createFinishedPromise from '../utils/create_finished_promise'

import type { MotionValue } from './motion'
import type { MotionAnimation } from './animation'
import type { Easing } from '../tween/interface'
import type { MotionValueEventCallbacks } from './motion/motion_event'
import clamp from '../utils/clamp'

export interface Transition {
  ease?: Easing
  delay?: number
  duration?: number
  autoplay?: boolean
}

export interface AnimationOptions extends Transition, MotionValueEventCallbacks {}

const run = (funcs: VoidFunction[]) => funcs.forEach((func) => isFunction(func) && func())

const max = (list: number[]) => Math.max.apply(null, list)

const sum = (list: number[]) => list.reduce((acc, cur) => acc + cur, 0)

export interface PlaybackControl {
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

// 获取 animate 所需要的时间
function getAnimateEasing(ease: Transition['ease']) {
  if (isFunction(ease)) return ease

  if (isArray(ease) && ease.length === 4) return cubicBezier(...ease)

  if (isString(ease) && easing[ease]) return easing[ease]

  return easing.linear
}

const transform = (numbers: number[], strings: string[]) => {
  return strings.reduce((result, str, i) => {
    const num = numbers[i] ?? ''
    return `${result}${str}${num}`
  }, '')
}

// 插值
const interpolator = (value: number, input: [number, number], output: [number, number]) => {
  const percent = (value - input[0]) / (input[1] - input[0])

  return output[0] + (output[1] - output[0]) * percent
}

// 负责调度 motion animations
export default function playbackControl<V extends string | number>(
  value: MotionValue<V>,
  animation: MotionAnimation,
  options: AnimationOptions = {}
): PlaybackControl {
  const finishedPromise = createFinishedPromise()

  finishedPromise.update()

  let speed = 1
  let playState: AnimationPlayState = 'idle'

  const duration = options.duration ?? 300

  const ease = getAnimateEasing(options.ease)

  let startTime = 0
  const tick = (time: number) => {
    if (!startTime) startTime = time

    if (startTime === time) value.notify('onStart')

    const current: number[] = []

    const { length } = animation.to.numbers

    const elapsed = clamp(time - startTime, 0, duration) / duration

    for (let i = 0; i < length; i += 1) {
      const from = animation.from.numbers[i]
      const to = animation.to.numbers[i]

      current.push(interpolator(ease(elapsed), [0, 1], [from, to]))
    }

    const next = transform(current, animation.to.strings)

    value.notify('onUpdate', next)

    value.set(next as V)

    if (elapsed === 1) value.notify('onComplete')

    return elapsed < 1
  }

  const play = () => {
    if (playState === 'running') return
    playState = 'running'

    raf(tick)
  }

  return {
    get time() {
      return startTime
    },
    set time(t: number) {
      startTime = t
    },
    get speed() {
      return speed
    },
    set speed(s: number) {
      speed = 1
    },
    get duration() {
      return duration
    },

    play,

    pause: () => {},

    stop: () => {},

    complete: () => {},

    cancel: () => {},

    // thenable
    then(onfulfilled: VoidFunction, onrejected?: VoidFunction) {
      return finishedPromise.get().then(onfulfilled, onrejected)
    },
  }
}
