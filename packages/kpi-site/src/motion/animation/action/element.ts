import { isObject } from '@kpi/shared'
import { playbackControl } from '../controller'
import elementTweens from '../tween/element'
import { resolveElements } from '../utils/resolve'

import type { PlaybackControl } from '../controller'
import type {
  AnimationOptions,
  AnimationScope,
  ElementKeyframes,
  ElementOrSelector,
  GenericKeyframes,
} from '../interface'

export default function animateElement(
  maybeElements: ElementOrSelector,
  keyframes: ElementKeyframes,
  options: Required<AnimationOptions>,
  scope?: AnimationScope
): PlaybackControl {
  const elements = resolveElements(maybeElements)

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
