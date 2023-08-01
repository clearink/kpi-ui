import { isUndefined, logger, pushItem, toArray } from '@kpi/shared'
import { TweenRenderer } from '../../scheduler'
import createTweenGenerator from '../../utils/generator'
import { normalizeEasings, normalizeTimes } from '../../utils/normalize'
import GeneratorItem from './utils/generator_item'
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

      // TODO
      const $keyframes = normalizeTargets(element, property, target)

      const setter = createSetter(element, property)

      // 这里需要重新设计
      const emitter = () => {}

      const times = normalizeTimes($keyframes.length, $times)

      logger(times[0] !== 0, 'Please ensure times[0] equal 0')

      const easings = normalizeEasings($keyframes.length, toArray(easing))

      // TODO: GeneratorItem 需要重新设计
      const targets = $keyframes.map((keyframe) => new GeneratorItem(keyframe))

      const generator = createTweenGenerator(targets, times, easings, repeatType)

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
