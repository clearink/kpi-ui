import { isObject } from '@kpi/shared'
import { playbackControl } from '../controller'
import selector from '../../utils/selector'
import elementTweens from './tween'

import type { PlaybackControl } from '../controller'
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
): PlaybackControl {
  const elements = selector(maybeElements)

  const tweens = elementTweens(elements, keyframes, options)

  const control = playbackControl(tweens)

  if (options.autoplay) control.play()

  return control
}

// 是否为 html 元素动画
export function isElementAnimation<V>(
  keyframes: V | GenericKeyframes<V> | ElementKeyframes
): keyframes is ElementKeyframes {
  return isObject(keyframes)
}
