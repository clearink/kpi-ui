import { pushItem } from '@kpi/shared'
import updateGenerator from '../../generator'
import { TweenAnimation, TweenTimeline } from '../../scheduler'
import { normalizeTimes } from '../../utils/normalize'
import createTweenEmitter from './utils/emitter'
import GeneratorItem from './utils/generator_item'
import { normalizeKeyframes } from './utils/normalize'

import type { MotionValue } from '../../../motion'
import type { AnimatableValue, GenericKeyframes, TweenOptions } from '../../interface'

export default function makeTimeline<V extends AnimatableValue>(
  motion: MotionValue<V>,
  to: V | GenericKeyframes<V>,
  options: TweenOptions
) {
  const keyframes = normalizeKeyframes(motion.get(), to)

  // const emitter = createTweenEmitter(motion, options)

  // const times = normalizeTimes(keyframes.length, options.times || [])

  // const items = keyframes.map((item) => new GeneratorItem(item))

  // const generate = updateGenerator(items, options)

  // const update = (progress: number, iteration: number) => {
  //   motion.set(generate(progress, iteration) as V)
  //   emitter('update')
  // }

  const animations = keyframes.reduce((result, current, i) => {
    if (i === 0) return result

    const animation = new TweenAnimation([keyframes[i - 1], current])

    return pushItem(result, animation)
  }, [] as TweenAnimation[])

  return new TweenTimeline(animations, options)
}
