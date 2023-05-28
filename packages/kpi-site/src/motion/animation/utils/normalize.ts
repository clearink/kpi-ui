import { isArray, isFunction, isNull, isString, toArray } from '@kpi/shared'
import { eases } from '../../easing'
import { getBezierCache } from '../../utils/cache'

import type { Easing } from '../../easing/interface'
import type { AnimatableValue, GenericKeyframes } from '../interface'

export const normalizeEasings = (length: number, easings: Easing[]) => {
  return Array.from({ length }, (_, i) => {
    const easing = easings[i]

    if (isFunction(easing)) return easing

    if (isArray(easing) && easing.length === 4) return getBezierCache(easing)

    if (isString(easing) && eases[easing]) return eases[easing]

    return eases.linear
  })
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

export const normalizeTweenTransition = () => {}
