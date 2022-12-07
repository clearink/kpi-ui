/* eslint-disable @typescript-eslint/naming-convention */
import { toArray } from '../../../utils'

import type { NamePath } from '../props'

// 字段是否被隐式依赖，形如 ['username'] 与 ['username', 'a', 'b']
// ['username', 'a'] 会影响 ['username']
// ['username'] 不会影响 ['username', 'a']
export function isDependent($path: NamePath, $other: NamePath, equal = false) {
  const path = toArray($path)
  const other = toArray($other)
  const len = Math.min(path.length, other.length)

  if (len === 0) return false

  for (let i = 0; i < len; i++) {
    if (path[i] !== other[i]) return false
  }

  if (equal) return path.length === other.length

  return path.length <= other.length
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
