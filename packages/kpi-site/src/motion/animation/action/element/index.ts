import { isObject } from '@kpi/shared'
import selector from '../../utils/selector'
import elementTweens from './tween'
import { Controller } from '../../engine'

import type {
  AnimateElementOptions,
  AnimationScope,
  ElementKeyframes,
  GenericKeyframes,
  ScheduleOptions,
} from '../../interface'
import type { ElementOrSelector } from '../../utils/selector'

export default function animateElement(
  maybeElements: ElementOrSelector,
  keyframes: ElementKeyframes,
  options: AnimateElementOptions,
  scope?: AnimationScope
): Controller {
  const elements = selector(maybeElements)

  const renderers = elementTweens(elements, keyframes, options)

  const scheduleOptions = {} as ScheduleOptions
  const control = new Controller(renderers, () => {}, scheduleOptions)

  if (options.autoplay) control.play()

  return control
}

// 是否为 html 元素动画
export function isElementAnimation<V>(
  keyframes: V | GenericKeyframes<V> | ElementKeyframes
): keyframes is ElementKeyframes {
  return isObject(keyframes)
}
