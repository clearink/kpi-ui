import { isArray, isFunction, isNull, isString } from '@kpi/shared'
import { cubicBezier, eases } from '../../easing'

import type { Easing, EasingFunction } from '../../easing/interface'
import type { AnimatableValue, GenericKeyframes } from '../interface'

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

export const normalizeTweenTarget = <V extends AnimatableValue>(
  from: V,
  to: V | GenericKeyframes<V>
): V[] => {
  if (!isArray(to)) return [from, to]

  return to.map((item, i) => (i === 0 && isNull(item) ? from : item))
}

export const normalizeTweenTimes = <V extends AnimatableValue>(target: V[], times: number[]) => {
  const steps = target.length

  if (steps === times.length) return times

  const resolved = [0]

  for (let i = 0; i < steps - 1; i += 1) {
    resolved.push((1 / (steps - 1)) * (i + 1))
  }

  return resolved
}
