import decompose from '../../../utils/decompose'
import updateGenerator from '../../generator'
import { TweenRenderer } from '../../scheduler'
import createTweenEmitter from './utils/emitter'
import { normalizeKeyframes } from './utils/normalize'

import type { MotionValue } from '../../../motion'
import type { AnimatableValue, GenericKeyframes, TweenOptions } from '../../interface'

export default function createTweenRenderer<V extends AnimatableValue>(
  motion: MotionValue<V>,
  to: V | GenericKeyframes<V>,
  options: TweenOptions
) {
  const keyframes = normalizeKeyframes(motion.get(), to)

  const targets = keyframes.map((original) => {
    return { original, formatted: decompose(original) }
  })

  const emitter = createTweenEmitter(motion, options)

  const generate = updateGenerator(targets, options)

  const update = (progress: number, iterations: number) => {
    motion.set(generate(progress, iterations))
  }

  // 目前来看，确实需要 在 renderer 中添加一个 init 函数
  // 当设置为 keyframes 时, 主动触发一次 update 事件
  // if (isArray(to)) emitter('update', update(0, 0))

  return new TweenRenderer(emitter, update, options)
}
