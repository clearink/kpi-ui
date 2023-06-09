import { isObject } from '@kpi/shared'
import { TweenController } from '../../tween'
import selector from '../../utils/selector'
import createElementsRenderer from './renderer'

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
  const elements = selector(maybeElements, scope)

  const renderers = createElementsRenderer(elements, keyframes, options)

  const controllerOptions = {} as any
  const control = new TweenController(renderers, () => {}, controllerOptions)

  if (options.autoplay) control.play()

  return control
}

// 是否为 html 元素动画
export function isElementAnimation<V>(
  keyframes: V | GenericKeyframes<V> | ElementKeyframes
): keyframes is ElementKeyframes {
  return isObject(keyframes)
}
