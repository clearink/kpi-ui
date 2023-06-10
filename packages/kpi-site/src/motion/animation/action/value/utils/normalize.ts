import { isArray, isFunction, isNull, isString } from '@kpi/shared'
import Options from '../../../config/options'
import { cubicBezier, eases } from '../../../../easing'
import angle from '../../../../parse/angle'
import color from '../../../../parse/color'
import { pushItem } from '../../../../utils/array'

import type { Easing } from '../../../../easing/interface'
import type { GenericKeyframes } from '../../../interface'

export function normalizeKeyframes<V>(from: V, to: V | GenericKeyframes<V>) {
  const targets = isArray(to) ? to : [null, to]

  return targets.reduce((result: V[], target, i) => {
    if (!isNull(target)) return pushItem(result, target)

    return pushItem(result, i === 0 ? from : result[i - 1])
  }, [])
}

export function normalizeTargets<V>(from: V, to: V | GenericKeyframes<V>) {
  return normalizeKeyframes(from, to).map((item) => {
    if (!isString(item)) return item

    if (color.test(item)) return color.transform(color.parse(item)) as V

    if (angle.test(item)) return angle.transform(angle.parse(item)) as V

    return item
  })
}

export function normalizeEasings(steps: number, easings: Easing[]) {
  return Array.from({ length: steps - 1 }, (_, i) => {
    const easing = easings[i]

    if (isFunction(easing)) return easing

    if (isArray(easing) && easing.length === 4) return cubicBezier(...easing)

    if (isString(easing) && eases[easing]) return eases[easing]

    return Options.easing
  })
}

export function normalizeTimes(steps: number, times: number[]) {
  if (steps === times.length) return times

  // TODO: 是否从头开始分配?
  const resolved = [0]

  for (let i = 0; i < steps - 1; i += 1) {
    resolved.push((1 / (steps - 1)) * (i + 1))
  }

  return resolved
}
