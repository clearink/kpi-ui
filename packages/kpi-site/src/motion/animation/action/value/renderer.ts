import { isArray, logger, toArray } from '@kpi/shared'
import { motionValue } from '../../../motion'
import { TweenRenderer } from '../../scheduler'
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

  const times = normalizeTimes(targets.length, $times)

  logger(times[0] !== 0, 'Please ensure times[0] equal 0')

  const easings = normalizeEasings(targets.length, toArray($easing))

  const emitter = createTweenEmitter(motion, rendererOptions)

  const generator = createTweenGenerator(targets, times, easings, repeatType)

  const render = (ratio: number, iterations: number): any =>
    motion.set(generator(ratio, iterations))

  // 当设置为 keyframes 时, 主动触发一次 update 事件
  isArray(to) && emitter('update', motion.set(targets[0]))

  return new TweenRenderer(emitter, render, rendererOptions)
}
