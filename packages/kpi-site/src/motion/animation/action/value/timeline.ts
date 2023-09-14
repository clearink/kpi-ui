import { TweenTimeline, updateGenerator } from '../../scheduler'
import makeTweenEmitter from './utils/emitter'
import { normalizeKeyframes } from './utils/normalize'
import makeAnimations from './utils/animation'

import type { MotionValue } from '../../../motion'
import type { AnimatableValue, GenericKeyframes, TweenOptions } from '../../interface'

export default function makeTimeline<V extends AnimatableValue>(
  motion: MotionValue<V>,
  to: V | GenericKeyframes<V>,
  options: TweenOptions
) {
  const keyframes = normalizeKeyframes(motion.get(), to)

  const emitter = makeTweenEmitter(motion, options)

  const animations = makeAnimations(keyframes)

  const generate = updateGenerator<V>(animations, options)

  const update = (progress: number, iteration: number) => {
    motion.set(generate(progress, iteration))
    emitter('update')
  }

  return new TweenTimeline(emitter, update, options)
}
