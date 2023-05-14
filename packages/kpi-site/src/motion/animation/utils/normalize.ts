import { isArray, isFunction, isString } from '@kpi/shared'
import { cubicBezier, eases } from '../../easing'

import type { Easing, EasingFunction } from '../../easing/interface'

const cubicBezierCache = new Map<string, EasingFunction>()

export const normalizeEasing = (easing?: Easing) => {
  if (isFunction(easing)) return easing

  if (isArray(easing) && easing.length === 4) {
    const key = easing.join('$')

    if (!cubicBezierCache.has(key)) cubicBezierCache.set(key, cubicBezier(...easing))

    return cubicBezierCache.get(key)!
  }

  if (isString(easing) && eases[easing]) return eases[easing]

  return eases.linear
}

export const normalizeTimes = (times: number[]) => {}
