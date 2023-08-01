import { isArray, logger, toArray } from '@kpi/shared'
import { TweenRenderer } from '../../scheduler'
import createTweenGenerator from '../../utils/generator'
import { normalizeEasings, normalizeTimes } from '../../utils/normalize'
import createTweenEmitter from './utils/emitter'
import GeneratorItem from './utils/generator_item'
import { normalizeKeyframes } from './utils/normalize'

import type { MotionValue } from '../../../motion'
import type { AnimatableValue, GenericKeyframes, TweenOptions } from '../../interface'

export default function createTweenRenderer<V extends AnimatableValue>(
  motion: MotionValue<V>,
  to: V | GenericKeyframes<V>,
  options: TweenOptions
) {
  const { times: $times = [], easing, repeatType } = options

  const keyframes = normalizeKeyframes(motion.get(), to)

  const emitter = createTweenEmitter(motion, options)

  const times = normalizeTimes(keyframes.length, $times)

  logger(times[0] !== 0, 'Please ensure times[0] equal 0')

  const easings = normalizeEasings(keyframes.length, toArray(easing))

  const targets = keyframes.map((keyframe) => new GeneratorItem(keyframe))

  const generator = createTweenGenerator(targets, times, easings, repeatType)

  const update = (progress: number, iterations: number) => {
    motion.set(generator(progress, iterations))
  }

  // 当设置为 keyframes 时, 主动触发一次 update 事件
  if (isArray(to)) emitter('update', update(0, 0))

  return new TweenRenderer(emitter, update, options)
}
