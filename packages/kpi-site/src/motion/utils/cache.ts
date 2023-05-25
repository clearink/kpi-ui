import { cubicBezier } from '../easing'

import type { BezierDefinition, EasingFunction } from '../easing/interface'
import type { MotionValue } from '../motion'

export const motionPromiseCache = new WeakMap<MotionValue, any>()

export const bezierCache = new Map<string, EasingFunction>()
export const getBezierCache = (easing: BezierDefinition) => {
  const key = easing.join('$')

  if (bezierCache.has(key)) return bezierCache.get(key)!

  const bezier = cubicBezier(...easing)

  bezierCache.set(key, bezier)

  return bezier
}

export const valueTweens = new WeakMap<Element, any>()
export const getElementCache = (element: Element) => {
  if (valueTweens.has(element)) return valueTweens.get(element)!

  const cache = {}

  valueTweens.set(element, cache)

  return cache
}
