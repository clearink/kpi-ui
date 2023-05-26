/* eslint-disable no-param-reassign */
import { hasOwn, isNullish } from '@kpi/shared'

import type { ResolvedTransform } from '../interface'

export const defaultTransformValue = Object.freeze({
  perspective: 0,
  translateX: 0,
  translateY: 0,
  translateZ: 0,
  rotate: 0,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
  scale: 1,
  scaleX: 1,
  scaleY: 1,
  scaleZ: 1,
  skew: 0,
  skewX: 0,
  skewY: 0,
})

const makeSetter =
  <V extends ResolvedTransform, K extends keyof V>(key: K) =>
  (resolved: V, value: V[K]) => {
    if (isNullish(value)) return resolved

    if (!hasOwn(resolved, key)) resolved[key] = (defaultTransformValue as V)[key]

    resolved[key] = value

    return resolved
  }

export const transformProps = Object.freeze({
  p: makeSetter('perspective'),
  perspective: makeSetter('perspective'),
  x: makeSetter('translateX'),
  translateX: makeSetter('translateX'),
  y: makeSetter('translateY'),
  translateY: makeSetter('translateY'),
  z: makeSetter('translateZ'),
  translateZ: makeSetter('translateZ'),
  scale: makeSetter('scale'),
  scaleX: makeSetter('scaleX'),
  scaleY: makeSetter('scaleY'),
  scaleZ: makeSetter('scaleZ'),
  rotate: makeSetter('rotate'),
  rotateX: makeSetter('rotateX'),
  rotateY: makeSetter('rotateY'),
  rotateZ: makeSetter('rotateZ'),
  skew: makeSetter('skew'),
  skewX: makeSetter('skewX'),
  skewY: makeSetter('skewY'),
})

// 解析
export const resolveTransformStyle = () => {}

export const isTransformPropEqual = () => {}
