import { isFunction } from '@kpi/shared'
import Options from '../config/options'

import type { EasingFunction } from '../interface'

export function normalizeEasings(steps: number, easings: EasingFunction[]) {
  return Array.from({ length: steps - 1 }, (_, i) => {
    const easing = easings[i]

    return isFunction(easing) ? easing : Options.easing
  })
}

export function normalizeTimes(steps: number, times: number[]) {
  if (steps === times.length) return times

  const resolved = [0]

  for (let i = 0; i < steps - 1; i += 1) {
    resolved.push((1 / (steps - 1)) * (i + 1))
  }

  return resolved
}
