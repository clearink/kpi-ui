/* eslint-disable @typescript-eslint/naming-convention */
import { toArray } from '@kpi/shared'

import type { InternalNamePath } from '../internal_props'
import type { NamePath } from '../props'

export function isDependent(path: InternalNamePath, other: InternalNamePath) {
  const len = Math.min(path.length, other.length)

  for (let i = 0; i < len; i += 1) {
    if (path[i] !== other[i]) return false
  }

  return len > 0
}

const SEPARATOR = '_$_KPI_FORM_CONTROL_$_'
// 获取名称字符串
export function _getName(namePath: NamePath) {
  const paths = toArray(namePath)

  return paths.map((item) => `${typeof item}:${item}`).join(SEPARATOR)
}

export function isValidIndex(array: any[], ...positions: number[]) {
  return positions.every((position) => position >= 0 && position < array.length)
}
