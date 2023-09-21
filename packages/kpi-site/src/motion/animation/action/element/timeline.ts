import { isArray, isNullish, isUndefined, pushItem } from '@kpi/shared'
import { TweenTimeline, updateGenerator } from '../../scheduler'
import makeAccessor from './utils/accessor'
import makeAnimations from './animation'

import type { AnimateElementOptions, ElementKeyframes } from '../../interface'
import makeTweenEmitter from './emitter'

export default function makeTimelines(
  elements: HTMLElement[],
  elementKeyframes: ElementKeyframes,
  options: AnimateElementOptions
) {
  return elements.reduce((result: TweenTimeline[], element) => {
    Object.entries(elementKeyframes).forEach(([property, target]) => {
      if (isUndefined(target)) return

      const transition = isNullish(options[property]) ? options : options[property]

      const keyframes = isArray(target) ? target : [null, target]

      const accessor = makeAccessor(element, property)

      const animations = makeAnimations(element, accessor, keyframes)

      const emitter = makeTweenEmitter(transition)

      const generate = updateGenerator(animations, transition)

      const update = (progress: number, iteration: number) => {
        const value = generate(progress, iteration) as string
        accessor.set(value)
        emitter('update', value)
      }

      // if(isArray(target)) update(0, 0)

      pushItem(result, new TweenTimeline(emitter, update, transition))
    })

    return result
  }, [])
}
