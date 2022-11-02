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

// 获取 source 的全部路径
export function getPaths(source: any, parent: InternalNamePath = []): InternalNamePath[] {
  // 不是对象或数组
  if (!isObject(source) && !isArray(source)) return [parent]
  const isAnArray = isArray(source)
  // 空数组
  if (isAnArray && source.length === 0) return [parent]
  return Object.entries(source).reduce((res, [key, value]) => {
    const current = parent.concat(isAnArray ? Number(key) : key)
    return res.concat(getPaths(value, current))
  }, [] as InternalNamePath[])
}

export function isValidIndex(array: any[], ...positions: number[]) {
  return positions.every((position) => position >= 0 && position < array.length)
}
