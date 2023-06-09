import { toArray } from '@kpi/shared'
import { motionValue } from '../../../motion'
import { TweenRenderer } from '../../tween'
import createTweenEmitter from './utils/emitter'
import createTweenGenerator from './utils/generator'
import { normalizeEasings, normalizeTargets, normalizeTimes } from './utils/normalize'

import type { MotionValue } from '../../../motion'
import type { AnimatableValue, GenericKeyframes, TweenOptions } from '../../interface'

export default function createTweenRenderer<V extends AnimatableValue>(
  from: V | MotionValue<V>,
  to: V | GenericKeyframes<V>,
  rendererOptions: TweenOptions
) {
  const { times: $times = [], easing: $easing, repeatType } = rendererOptions

  const motion = motionValue(from)

  // 只解析 color, angle 形式的字符串
  const targets = normalizeTargets(motion.get(), to)

  const times = normalizeTimes(targets, $times)

  const easings = normalizeEasings(times.length, toArray($easing))

  const emitter = createTweenEmitter(motion, rendererOptions)

  const generator = createTweenGenerator(targets, times, easings, repeatType)

  const render = (progress: number, iterations: number) =>
    motion.set(generator(progress, iterations))

  return new TweenRenderer(emitter, render, rendererOptions)
}
