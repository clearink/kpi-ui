import { isArray, isUndefined, logger, pushItem, toArray } from '@kpi/shared'
import { TweenRenderer } from '../../scheduler'
import { normalizeEasings, normalizeTimes } from '../../utils/normalize'
import createRendererGenerator from '../value/utils/generator'
import { normalizeTargets, normalizeTransition } from './utils/normalize'
import createSetter from './utils/setter'

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

      const setter = createSetter(element, property)

      // 这里需要重新设计
      const emitter = () => {}

      const times = normalizeTimes(targets.length, $times)

      logger(times[0] !== 0, 'Please ensure times[0] equal 0')

      const easings = normalizeEasings(targets.length, toArray(easing))

      const generator = createRendererGenerator(targets, times, easings, repeatType)

      const update = (progress: number, iterations: number) => {
        setter(generator(progress, iterations))
      }

      // 当设置为 keyframes 时, 主动触发一次 update 事件
      // if (isArray(target)) emitter('update', update(0, 0))

      pushItem(result, new TweenRenderer(emitter, update, transition))
    })

    return result
  }, [])
}
