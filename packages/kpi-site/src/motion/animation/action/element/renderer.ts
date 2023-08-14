import { isUndefined, logger, pushItem, toArray } from '@kpi/shared'
import decompose from '../../../utils/decompose'
import { defineGetter } from '../../../utils/define'
import updateGenerator from '../../generator'
import { TweenRenderer } from '../../scheduler'
import { normalizeEasings, normalizeTimes } from '../../utils/normalize'
import GeneratorItem from './utils/generator_item'
import { normalizeKeyframes, normalizeTransition } from './utils/normalize'
import createSetter from './utils/setter'

import type { AnimatableValue, AnimateElementOptions, ElementKeyframes } from '../../interface'

export default function createTweenRenderer(
  elements: Element[],
  keyframes: ElementKeyframes,
  options: AnimateElementOptions
) {
  return elements.reduce((result: TweenRenderer[], element) => {
    Object.entries(keyframes).forEach(([property, target]) => {
      if (isUndefined(target)) return

      const transition = normalizeTransition(options[property], options)

      // TODO: GeneratorItem 需要重新设计
      const $keyframes = normalizeKeyframes(element, property, target)

      const targets = $keyframes.map((keyframe) => new GeneratorItem(element, property, keyframe))
      // 需要提前将 property 的 默认值以及 setter 给出来

      // 这里需要重新设计
      const emitter = () => {}

      const generate = updateGenerator(targets, transition)

      const update = (progress: number, iterations: number) => {
        const next = generate(progress, iterations)
        // setter(value)
        emitter()
      }

      // 当设置为 keyframes 时, 主动触发一次 update 事件
      // if (isArray(target)) emitter('update', update(0, 0))

      pushItem(result, new TweenRenderer(emitter, update, transition))
    })

    return result
  }, [])
}
