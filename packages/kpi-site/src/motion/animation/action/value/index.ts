import { isObjectLike, noop, toArray } from '@kpi/shared'
import { isMotionValue, motionValue } from '../../../motion'
import { Controller, Renderer } from '../../engine'
import { normalizeControllerOptions, normalizeTimelineOptions } from '../../utils/normalize'
import { createTweenEmitter } from './utils/emitter'
import createTweenGenerator from './utils/generator'
import { normalizeEasings, normalizeTargets, normalizeTimes } from './utils/normalize'
import resolveTarget from './utils/resolve'

import type { MotionValue } from '../../../motion'
import type { AnimatableValue, AnimateValueOptions, GenericKeyframes } from '../../interface'
import type { ElementOrSelector } from '../../utils/selector'

// string | number 动画效果
export default function animateValue<V extends AnimatableValue>(
  from: V | MotionValue<V>,
  to: V | GenericKeyframes<V>,
  options: AnimateValueOptions<V>
): Controller {
  const { times: $times = [], easing: $easing } = options

  const motion = motionValue(from)

  // 只解析 color, angle 形式的字符串
  const targets = resolveTarget(normalizeTargets(motion.get(), to))

  const times = normalizeTimes(targets, $times)

  const easings = normalizeEasings(times.length, toArray($easing))

  const generator = createTweenGenerator(targets, times, easings)

  const render = (progress: number) => motion.set(generator(progress))

  const emitter = createTweenEmitter(motion, options)

  // 获取属于 renderer 自己的 options
  const timelineOptions = normalizeTimelineOptions([[motion, to, options]] as any)

  const renderOptions = timelineOptions[0]

  const controllerOptions = normalizeControllerOptions(timelineOptions)

  const renderer = new Renderer(emitter, render, renderOptions)

  return new Controller([renderer], noop, controllerOptions)
}

export function isValueAnimation<V extends AnimatableValue>(
  animateInput: V | MotionValue<V> | ElementOrSelector
): animateInput is V | MotionValue<V> {
  return !isObjectLike(animateInput) || isMotionValue(animateInput as any)
}
