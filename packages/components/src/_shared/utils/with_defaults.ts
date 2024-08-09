import type { MayBe } from '@internal/types'

import { isObject, shallowMerge } from '@internal/utils'

export function withDefaults<V extends Record<string, any>>(source: V, ...partials: MayBe<Partial<V>>[]) {
  let result = { ...source }

  for (let i = 0, len = partials.length; i < len; i++) {
    const partial = partials[i]

    if (isObject(partial)) result = shallowMerge(result, partial)
  }
  return result
}
