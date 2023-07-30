import { isUndefined, logger, pushItem, toArray } from '@kpi/shared'
import { TweenRenderer } from '../../scheduler'
import { normalizeEasings, normalizeTimes } from '../../utils/normalize'
import createRendererGenerator from '../value/utils/generator'
import { normalizeTargets, normalizeTransition } from './utils/normalize'

import type { AnimateElementOptions, ElementKeyframes } from '../../interface'

export default function createElementsRenderer(
  elements: Element[],
  keyframes: ElementKeyframes,
  options: AnimateElementOptions
) {
  return elements.reduce((result: TweenRenderer[], element) => {
    Object.entries(keyframes).forEach(([property, target]) => {
      if (isUndefined(target)) return

      const transition = normalizeTransition(options[property], options)

      const { times: $times = [], easing, repeatType } = transition

      const targets = normalizeTargets(element, property, target)

      const times = normalizeTimes(targets.length, $times)

      logger(times[0] !== 0, 'Please ensure times[0] equal 0')

      const easings = normalizeEasings(targets.length, toArray(easing))

      const generator = createRendererGenerator(targets, times, easings, repeatType)

      const update = (progress: number, iterations: number) => {
        const value = generator(progress, iterations) as string
        console.log(value)
        // 这里需要重新设计
        ;(element as HTMLElement).style.setProperty('transform', `translate3d(${value}px, 0, 0)`)
      }

      // 这里需要重新设计
      const emitter = () => {}

      pushItem(result, new TweenRenderer(emitter, update, transition))
    })

    return result
  }, [])
}
