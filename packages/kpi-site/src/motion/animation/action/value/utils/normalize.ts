import { isArray, isFunction, isNull, isString } from '@kpi/shared'
import { pushItem } from '../../../../utils/array'
import { cubicBezier, eases } from '../../../../easing'

import type { Easing } from '../../../../easing/interface'
import type { AnimatableValue, GenericKeyframes } from '../../../interface'

export function normalizeTargets<V>(from: V, to: V | GenericKeyframes<V>) {
  const targets = isArray(to) ? to : [null, to]

  return targets.reduce((result: V[], target, i) => {
    if (!isNull(target)) return pushItem(result, target)

    return pushItem(result, i === 0 ? from : result[i - 1])
  }, [])
}

export function normalizeEasings(length: number, easings: Easing[]) {
  return Array.from({ length }, (_, i) => {
    const easing = easings[i]

    if (isFunction(easing)) return easing

    if (isArray(easing) && easing.length === 4) return cubicBezier(...easing)

    if (isString(easing) && eases[easing]) return eases[easing]

    return eases.easeInBack
  })
}

export function normalizeTimes<V extends AnimatableValue>(target: V[], times: number[]) {
  const steps = target.length

  if (steps <= times.length) return times

  // TODO: 是否从头开始分配?
  const resolved = [0]

  for (let i = 0; i < steps - 1; i += 1) {
    resolved.push((1 / (steps - 1)) * (i + 1))
  }

  return resolved
}
