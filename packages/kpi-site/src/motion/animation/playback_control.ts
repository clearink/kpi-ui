/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */

import { isFunction, isArray, isString } from '@kpi/shared'
import { easings, cubicBezier } from '../tween'

import makeControlledPromise from '../utils/make_controlled_promise'

import type { MotionAnimation } from './make_animation'
import type { AnimatableValue, AnimationOptions, Transition } from './interface'

const run = (funcs: VoidFunction[]) => funcs.forEach((func) => isFunction(func) && func())

const max = (list: number[]) => Math.max.apply(null, list)

const sum = (list: number[]) => list.reduce((acc, cur) => acc + cur, 0)

// 获取 animate 所需要的时间
function getAnimateEasing(ease: Transition['ease']) {
  if (isFunction(ease)) return ease

  if (isArray(ease) && ease.length === 4) return cubicBezier(...ease)

  if (isString(ease) && easings[ease]) return easings[ease]

  return easings.linear
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

export class PlaybackControl {
  private promise = makeControlledPromise()

  constructor(private animations: MotionAnimation[]) {
    this.promise.update()
  }

  // motion time
  time!: number

  // motion speed
  speed = 1

  // lasted animation end time
  duration!: number

  // stop animation
  stop = () => {}

  // play animation
  play = () => {}

  // pause animation
  pause = () => {}

  // finish animation
  finish = () => {}

  cancel = () => {}

  then(onfulfilled: VoidFunction, onrejected?: VoidFunction) {
    return this.promise.get().then(onfulfilled, onrejected)
  }
}

// 负责调度 motion animations
export function playbackControl<V extends AnimatableValue = AnimatableValue>(
  animations: MotionAnimation<V>[],
  options: AnimationOptions = {}
) {
  return new PlaybackControl(animations)
}
