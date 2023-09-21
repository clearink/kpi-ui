import { isArray } from '@kpi/shared'
import { TweenTimeline, updateGenerator } from '../../scheduler'
import makeTweenEmitter from './emitter'
import makeAnimations from './animation'

import type { MotionValue } from '../../../motion'
import type { AnimatableValue, GenericKeyframes, TweenOptions } from '../../interface'

export default function makeTimeline<V extends AnimatableValue>(
  motion: MotionValue<V>,
  to: V | GenericKeyframes<V>,
  options: TweenOptions
) {
  const keyframes = isArray(to) ? to : [null, to]

  const emitter = makeTweenEmitter(motion, options)

  const animations = makeAnimations<any>(motion, keyframes)

  const generate = updateGenerator(animations, options)

  const update = (progress: number, iteration: number) => {
    const value = generate(progress, iteration) as V
    motion.set(value)
    emitter('update', value)
  }

  if (isArray(to)) update(0, 0)

  return new TweenTimeline(emitter, update, options)
}
