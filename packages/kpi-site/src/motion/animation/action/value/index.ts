import { isObjectLike, noop, toArray } from '@kpi/shared'
import { isMotionValue, motionValue } from '../../../motion'
import { TweenController, TweenRenderer } from '../../tween'
import createTweenEmitter from './utils/emitter'
import createTweenGenerator from './utils/generator'
import { normalizeEasings, normalizeTargets, normalizeTimes } from './utils/normalize'
import resolveTarget from './utils/resolve'

import type { MotionValue } from '../../../motion'
import type { AnimatableValue, GenericKeyframes, TweenOptions } from '../../interface'
import type { ElementOrSelector } from '../../utils/selector'

// string | number 动画效果
export default function animateValue<V extends AnimatableValue>(
  from: V | MotionValue<V>,
  to: V | GenericKeyframes<V>,
  rendererOptions: TweenOptions,
  controllerOptions: TweenOptions
) {
  const { times: $times = [], easing: $easing } = rendererOptions

  const motion = motionValue(from)

  // 只解析 color, angle 形式的字符串
  const targets = resolveTarget(normalizeTargets(motion.get(), to))

  const times = normalizeTimes(targets, $times)

  const easings = normalizeEasings(times.length, toArray($easing))

  const generator = createTweenGenerator(targets, times, easings)

  const render = (progress: number) => motion.set(generator(progress))

  const emitter = createTweenEmitter(motion, rendererOptions)

  const renderer = new TweenRenderer(emitter, render, rendererOptions)

  return new TweenController([renderer], noop, controllerOptions)
}

export function isValueAnimation<V extends AnimatableValue>(
  animateInput: V | MotionValue<V> | ElementOrSelector
): animateInput is V | MotionValue<V> {
  return !isObjectLike(animateInput) || isMotionValue(animateInput as any)
}
