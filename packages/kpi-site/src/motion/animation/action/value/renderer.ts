import { isArray, logger, toArray } from '@kpi/shared'
import decompose from '../../../utils/decompose'
import { defineGetter } from '../../../utils/define'
import { TweenRenderer } from '../../scheduler'
import updateGenerator from '../../utils/generator'
import { normalizeEasings, normalizeTimes } from '../../utils/normalize'
import createTweenEmitter from './utils/emitter'
import { normalizeKeyframes } from './utils/normalize'

import type { MotionValue } from '../../../motion'
import type { AnimatableValue, GenericKeyframes, TweenOptions } from '../../interface'

class GeneratorItem<V extends AnimatableValue> {
  formatted!: ReturnType<typeof decompose>

  constructor(public original: V) {
    let $formatted: this['formatted']
    defineGetter(this, 'formatted', () => {
      if (!$formatted) $formatted = decompose(original)
      return $formatted
    })
  }
}

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

  const generate = updateGenerator(targets, times, easings, repeatType)

  const update = (progress: number, iterations: number) => {
    motion.set(generate(progress, iterations))
  }

  // 当设置为 keyframes 时, 主动触发一次 update 事件
  if (isArray(to)) emitter('update', update(0, 0))

  return new TweenRenderer(emitter, update, options)
}
