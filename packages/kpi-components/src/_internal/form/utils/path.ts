import { rawType, toArray } from '@kpi-ui/utils'

import type { ExternalNamePath } from '../props'

export function _getName(namePath?: ExternalNamePath) {
  return toArray(namePath).reduce<string>((str, path) => {
    return `${str}_${rawType(str)}:${path}`
  }, '')
}

export function isValidIndex(array: any[], ...positions: number[]) {
  const len = array.length
  return positions.every((position) => position < len && position >= 0)
}
