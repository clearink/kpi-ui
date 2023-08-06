import { isArray, logger, toArray } from '@kpi/shared'
import decompose from '../../../utils/decompose'
import { defineGetter } from '../../../utils/define'
import updateGenerator from '../../generator'
import { TweenRenderer } from '../../scheduler'
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
  const keyframes = normalizeKeyframes(motion.get(), to)

  const targets = keyframes.map((keyframe) => new GeneratorItem(keyframe))

  const emitter = createTweenEmitter(motion, options)

  const generate = updateGenerator(targets, options)

  const update = (progress: number, iterations: number) => {
    motion.set(generate(progress, iterations))
  }

  // 当设置为 keyframes 时, 主动触发一次 update 事件
  if (isArray(to)) emitter('update', update(0, 0))

  return new TweenRenderer(emitter, update, options)
}
