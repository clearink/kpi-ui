/* eslint-disable no-param-reassign */
import { hasOwn, isNullish } from '@kpi/shared'

import type { AnimatableValue } from '../animation/interface'

// 类似 kute.js 一样 解析 元素的属性, 然后生成不同的tween,当这些 tween update 时, 设置元素相关的属性
export interface ResolvedTransform<V = AnimatableValue> {
  perspective?: V
  translateX?: V
  translateY?: V
  translateZ?: V
  rotate?: V
  rotateX?: V
  rotateY?: V
  rotateZ?: V
  scale?: V
  scaleX?: V
  scaleY?: V
  scaleZ?: V
  skewX?: V
  skewY?: V
}

const makeMotionTransformTuple = <V extends Required<ResolvedTransform>, K extends keyof V>(
  key: K,
  defaultValue: V[K]
) => {
  const setter = (resolved: V, value: V[K]) => {
    if (isNullish(value)) return resolved

    if (!hasOwn(resolved, key)) resolved[key] = defaultValue

    resolved[key] = value

    return resolved
  }
  return [defaultValue, setter] as const
}

export const motionTransformProps = Object.freeze({
  p: makeMotionTransformTuple('perspective', 0),
  perspective: makeMotionTransformTuple('perspective', 0),
  x: makeMotionTransformTuple('translateX', 0),
  translateX: makeMotionTransformTuple('translateX', 0),
  y: makeMotionTransformTuple('translateY', 0),
  translateY: makeMotionTransformTuple('translateY', 0),
  z: makeMotionTransformTuple('translateZ', 0),
  translateZ: makeMotionTransformTuple('translateZ', 0),
  scale: makeMotionTransformTuple('scale', 1),
  scaleX: makeMotionTransformTuple('scaleX', 1),
  scaleY: makeMotionTransformTuple('scaleY', 1),
  scaleZ: makeMotionTransformTuple('scaleZ', 1),
  rotate: makeMotionTransformTuple('rotate', 0),
  rotateX: makeMotionTransformTuple('rotateX', 0),
  rotateY: makeMotionTransformTuple('rotateY', 0),
  rotateZ: makeMotionTransformTuple('rotateZ', 0),
  skew: makeMotionTransformTuple('skewX', 0),
  skewX: makeMotionTransformTuple('skewX', 0),
  skewY: makeMotionTransformTuple('skewY', 0),
})

export default {
  test() {},
  parse() {},
  render(element: HTMLElement & SVGElement) {
    element.style.transform = ''
  },
}
