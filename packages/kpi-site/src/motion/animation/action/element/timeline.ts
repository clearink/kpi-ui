import { isUndefined, pushItem } from '@kpi/shared'
import { TweenTimeline, updateGenerator } from '../../scheduler'
import makeAccessor from './utils/accessor'
import makeAnimations from './utils/animation'
import { normalizeKeyframes, normalizeTransition } from './utils/normalize'

import type { AnimateElementOptions, ElementKeyframes } from '../../interface'

export default function makeTimelines(
  elements: Element[],
  elementKeyframes: ElementKeyframes,
  options: AnimateElementOptions
) {
  return elements.reduce((result: TweenTimeline[], element) => {
    Object.entries(elementKeyframes).forEach(([property, target]) => {
      if (isUndefined(target)) return

      const transition = normalizeTransition(options[property], options)

      const keyframes = normalizeKeyframes(element, property, target)

      const accessor = makeAccessor(element, property)

      const animations = makeAnimations(accessor, keyframes)

      // 这里需要重新设计
      const emitter = () => {}

      const generate = updateGenerator<string>(animations, transition)

      const update = (progress: number, iterations: number) => {
        accessor.set(generate(progress, iterations))
        // emitter('update')
      }

      pushItem(result, new TweenTimeline(emitter, update, transition))
    })

    return result
  }, [])
}
