import { isArray, isFunction, isString } from '@kpi/shared'
import { cubicBezier, easings } from '../../tween'

import type { Easing, EasingFunction } from '../../tween/interface'

const cubicBezierCache = new Map<string, EasingFunction>()

export const normalizeEasing = (easing?: Easing) => {
  if (isFunction(easing)) return easing

  if (isArray(easing) && easing.length === 4) {
    const key = easing.join('$')

    if (!cubicBezierCache.has(key)) cubicBezierCache.set(key, cubicBezier(...easing))

    return cubicBezierCache.get(key)!
  }

  if (isString(easing) && easings[easing]) return easings[easing]

  return easings.linear
}

export const normalizeAnimateCallbacks = () => {}
