import { isArray, isObject, toArray } from '../../_utils'
import type { InternalNamePath } from '../internal_props'
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

export function isValidIndex(array: any[], ...positions: number[]) {
  return positions.every((position) => position >= 0 && position < array.length)
}
