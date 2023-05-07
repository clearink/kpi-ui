import { isObject } from '@kpi/shared'

import type { PlaybackControl } from '../playback_control'
import { ElementOrSelector } from '../../utils/resolve_element'
import type {
  AnimatableValue,
  AnimationOptions,
  AnimationScope,
  DOMKeyframes,
  GenericKeyframes,
} from '../interface'

export default function animateElement<V extends AnimatableValue>(
  elementOrSelector: ElementOrSelector,
  keyframes: DOMKeyframes,
  options?: AnimationOptions,
  scope?: AnimationScope
): PlaybackControl {
  return {} as PlaybackControl
}

// 是否为 html 元素动画
export function isElementAnimation<V>(
  keyframes: V | GenericKeyframes<V> | DOMKeyframes
): keyframes is DOMKeyframes {
  return isObject(keyframes)
}
