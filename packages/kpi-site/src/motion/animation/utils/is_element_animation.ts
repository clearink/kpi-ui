import { isArray, isObject } from '@kpi/shared'
import type { MotionValue } from '../../motion'
import type { ElementOrSelector } from '../../utils/resolve_element'
import type { AnimatableValue, DOMKeyframesDefinition, GenericKeyframes } from '../interface'

// 是否为 html 元素动画
export default function isElementAnimation<V extends AnimatableValue>(
  animateInput: V | MotionValue<V> | ElementOrSelector,
  keyframes: V | GenericKeyframes<V> | DOMKeyframesDefinition<V>
) {
  if (animateInput instanceof Element || isArray(animateInput)) return true

  if (isArray(keyframes)) return keyframes.every((item) => isObject(item))

  if (isObject(keyframes)) return true

  return false
}
