import { isObject, shallowMerge } from '@kpi/shared'
import { TweenController } from '../../scheduler'
import selector from '../../utils/selector'
import createElementsRenderer from './renderer'

import type {
  AnimateElementOptions,
  AnimationScope,
  ElementKeyframes,
  GenericKeyframes,
} from '../../interface'
import type { ElementOrSelector } from '../../utils/selector'
import Options from '../../config/options'

export default function animateElement(
  maybeElements: ElementOrSelector,
  keyframes: ElementKeyframes,
  options: AnimateElementOptions,
  scope?: AnimationScope
) {
  const mergedOptions = shallowMerge(options, Options)

  const elements = selector(maybeElements, scope)

  const renderers = createElementsRenderer(elements, keyframes, mergedOptions)

  const lastRenderer = renderers[renderers.length - 1]

  const controllerOptions = { start: 0, duration: lastRenderer?.end } as any

  const controller = new TweenController(renderers, () => {}, controllerOptions)

  if (mergedOptions.autoplay) controller.play()

  return controller
}

// 是否为 html 元素动画
export function isElementAnimation<V>(
  keyframes: V | GenericKeyframes<V> | ElementKeyframes
): keyframes is ElementKeyframes {
  return isObject(keyframes)
}
