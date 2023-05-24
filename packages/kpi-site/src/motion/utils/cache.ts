import { cubicBezier } from '../easing'

import type { BezierDefinition, EasingFunction } from '../easing/interface'
import type { MotionValue } from '../motion'

export const motionPromiseCache = new WeakMap<MotionValue, any>()

export const bezierCache = new Map<string, EasingFunction>()

export const getBezierCache = (easing: BezierDefinition) => {
  const key = easing.join('$')

  if (!bezierCache.has(key)) bezierCache.set(key, cubicBezier(...easing))

  return bezierCache.get(key)!
}

export const valueTweens = new WeakMap<Element, any>()

export const ensureElementCache = (element: Element) => {
  if (valueTweens.has(element)) return
  valueTweens.set(element, {})
}

export const getElementCache = (element: Element) => {
  ensureElementCache(element)
  return valueTweens.get(element)!
}
