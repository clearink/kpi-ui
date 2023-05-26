/* eslint-disable no-param-reassign */
import { hasOwn, isNullish } from '@kpi/shared'

import type { ResolvedTransform, TransformProps } from '../interface'

const makeTransformTuple = <V extends Required<ResolvedTransform>, K extends keyof V>(
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

export const transformProps: TransformProps = Object.freeze({
  p: makeTransformTuple('perspective', 0),
  perspective: makeTransformTuple('perspective', 0),
  x: makeTransformTuple('translateX', 0),
  translateX: makeTransformTuple('translateX', 0),
  y: makeTransformTuple('translateY', 0),
  translateY: makeTransformTuple('translateY', 0),
  z: makeTransformTuple('translateZ', 0),
  translateZ: makeTransformTuple('translateZ', 0),
  scale: makeTransformTuple('scale', 1),
  scaleX: makeTransformTuple('scaleX', 1),
  scaleY: makeTransformTuple('scaleY', 1),
  scaleZ: makeTransformTuple('scaleZ', 1),
  rotate: makeTransformTuple('rotate', 0),
  rotateX: makeTransformTuple('rotateX', 0),
  rotateY: makeTransformTuple('rotateY', 0),
  rotateZ: makeTransformTuple('rotateZ', 0),
  skew: makeTransformTuple('skew', 0),
  skewX: makeTransformTuple('skewX', 0),
  skewY: makeTransformTuple('skewY', 0),
})

// 解析
export const resolveTransformStyle = () => {}

export const isTransformPropEqual = () => {}
