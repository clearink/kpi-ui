import { isUndefined, logger, pushItem, toArray } from '@kpi/shared'
import decompose from '../../../utils/decompose'
import { defineGetter } from '../../../utils/define'
import { TweenRenderer } from '../../scheduler'
import updateGenerator from '../../utils/generator'
import { normalizeEasings, normalizeTimes } from '../../utils/normalize'
import { normalizeKeyframes, normalizeTransition } from './utils/normalize'
import createSetter from './utils/setter'

import type { AnimatableValue, AnimateElementOptions, ElementKeyframes } from '../../interface'

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

export default function createTweenRenderer(
  elements: Element[],
  keyframes: ElementKeyframes,
  options: AnimateElementOptions
) {
  return elements.reduce((result: TweenRenderer[], element) => {
    Object.entries(keyframes).forEach(([property, target]) => {
      if (isUndefined(target)) return

      const transition = normalizeTransition(options[property], options)

      const { times: $times = [], easing, repeatType } = transition

      // 需要提前将 property 的 默认值以及 setter 给出来

      const $keyframes = normalizeKeyframes(element, property, target)

      console.log($keyframes)

      // 这里需要重新设计
      const emitter = () => {}

      const times = normalizeTimes($keyframes.length, $times)

      logger(times[0] !== 0, 'Please ensure times[0] equal 0')

      const easings = normalizeEasings($keyframes.length, toArray(easing))

      // TODO: GeneratorItem 需要重新设计
      const targets = $keyframes.map((keyframe) => new GeneratorItem(keyframe))

      const generate = updateGenerator(targets, times, easings, repeatType)

      const update = (progress: number, iterations: number) => {
        const value = generate(progress, iterations)
        // setter(value)
      }

      // 当设置为 keyframes 时, 主动触发一次 update 事件
      // if (isArray(target)) emitter('update', update(0, 0))

      pushItem(result, new TweenRenderer(emitter, update, transition))
    })

    return result
  }, [])
}
