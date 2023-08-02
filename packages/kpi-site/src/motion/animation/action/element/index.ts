import { isObject, shallowMerge } from '@kpi/shared'
import Options from '../../config/options'
import { TweenController } from '../../scheduler'
import selector from '../../utils/selector'
import createTweenRenderer from './renderer'

import type {
  AnimateElementOptions,
  AnimationScope,
  ElementKeyframes,
  GenericKeyframes,
} from '../../interface'
import type { ElementOrSelector } from '../../utils/selector'

export default function animateElement(
  maybeElements: ElementOrSelector,
  keyframes: ElementKeyframes,
  options: AnimateElementOptions,
  scope?: AnimationScope
) {
  const mergedOptions = shallowMerge(options, Options)

  const elements = selector(maybeElements, scope)

  const renderers = createTweenRenderer(elements, keyframes, mergedOptions)

  console.log(renderers)

  const controller = new TweenController(renderers)

  if (mergedOptions.autoplay) controller.play()

  return controller
}

// 是否为 html 元素动画
export function isElementAnimation<V>(
  keyframes: V | GenericKeyframes<V> | ElementKeyframes
): keyframes is ElementKeyframes {
  return isObject(keyframes)
}
