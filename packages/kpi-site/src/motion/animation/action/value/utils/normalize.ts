/* eslint-disable import/prefer-default-export */
import { isArray, isNull, pushItem } from '@kpi/shared'

import type { GenericKeyframes } from '../../../interface'

export function normalizeKeyframes<V>(from: V, to: V | GenericKeyframes<V>) {
  const targets = isArray(to) ? to : [null, to]

  return targets.reduce((result: V[], target, i) => {
    if (!isNull(target)) return pushItem(result, target)

    return pushItem(result, i === 0 ? from : result[i - 1])
  }, [])
}
