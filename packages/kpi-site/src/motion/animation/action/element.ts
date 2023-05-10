import { isObject } from '@kpi/shared'
import { makeElementTweens } from '../tween/element'
import resolveElements from '../../utils/resolve_element'

import type { PlaybackControl } from '../controller'
import type { ElementOrSelector } from '../../utils/resolve_element'
import type {
  AnimatableValue,
  AnimationOptions,
  AnimationScope,
  ElementKeyframes,
  GenericKeyframes,
} from '../interface'

export default function animateElement<V extends AnimatableValue>(
  maybeElements: ElementOrSelector,
  keyframes: ElementKeyframes,
  options: Required<AnimationOptions<V>>,
  scope?: AnimationScope
): PlaybackControl {
  const elements = resolveElements(maybeElements)

  const tweens = makeElementTweens()
  return {} as PlaybackControl
}

// 是否为 html 元素动画
export function isElementAnimation<V>(
  keyframes: V | GenericKeyframes<V> | ElementKeyframes
): keyframes is ElementKeyframes {
  return isObject(keyframes)
}
