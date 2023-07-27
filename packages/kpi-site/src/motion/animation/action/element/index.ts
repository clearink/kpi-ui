import { isObject, shallowMerge } from '@kpi/shared'
// import { defineHidden } from '../../../utils/define'
// import { $promise } from '../../../utils/symbol'
import Options from '../../config/options'
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

export default function animateElement(
  maybeElements: ElementOrSelector,
  keyframes: ElementKeyframes,
  options: AnimateElementOptions,
  scope?: AnimationScope
) {
  const mergedOptions = shallowMerge(options, Options)

  const elements = selector(maybeElements, scope)

  const renderers = createElementsRenderer(elements, keyframes, mergedOptions)

  const controller = new TweenController(renderers)

  // TODO: controller 挂到 element 上，下次 play 时可以取消掉
  // elements.forEach((element) => defineHidden(element, $promise, controller))

  if (mergedOptions.autoplay) controller.play()

  return controller
}

// 是否为 html 元素动画
export function isElementAnimation<V>(
  keyframes: V | GenericKeyframes<V> | ElementKeyframes
): keyframes is ElementKeyframes {
  return isObject(keyframes)
}
