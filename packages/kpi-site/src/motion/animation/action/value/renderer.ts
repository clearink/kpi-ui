import { logger, toArray } from '@kpi/shared'
import { TweenRenderer } from '../../scheduler'
import createTweenEmitter from './utils/emitter'
import { createRendererGenerator } from './utils/generator'
import { normalizeEasings, normalizeTargets, normalizeTimes } from './utils/normalize'

import type { MotionValue } from '../../../motion'
import type { AnimatableValue, GenericKeyframes, TweenOptions } from '../../interface'

export default function createTweenRenderer<V extends AnimatableValue>(
  motion: MotionValue<V>,
  to: V | GenericKeyframes<V>,
  rendererOptions: TweenOptions
) {
  const { times: $times = [], easing: $easing, repeatType } = rendererOptions

  // 只解析 color, angle 形式的字符串
  const targets = normalizeTargets(motion.get(), to)

  const times = normalizeTimes(targets.length, $times)

  logger(times[0] !== 0, 'Please ensure times[0] equal 0')

  const easings = normalizeEasings(targets.length, toArray($easing))

  const emitter = createTweenEmitter(motion, rendererOptions)

  const generator = createRendererGenerator(targets, times, easings, repeatType)

  const render = (progress: number, iterations: number) => {
    return motion.set(generator(progress, iterations))
  }

  return new TweenRenderer(emitter, render, rendererOptions)
}
