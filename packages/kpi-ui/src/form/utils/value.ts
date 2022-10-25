import { isNumber, isArray, isObject, isNullish, hasOwn, isObjectLike } from '../../_utils'

import type { InternalNamePath } from '../internal_props'

function internalSet<V = any>(
  source: V,
  paths: InternalNamePath,
  value: any,
  removeUndefined = false
): V {
  if (paths.length === 0) return value

  const [path, ...rest] = paths

  let attr = {} as V
  if (isArray(source)) attr = [...source] as unknown as V
  else if (isObject(source)) attr = { ...source }
  // source为基础类型时舍弃
  else if (isNumber(path)) attr = [] as unknown as V

  const $value = internalSet(attr[path], rest, value, removeUndefined)
  if ($value === undefined && removeUndefined) delete attr[path]
  else attr[path] = $value

  return attr
}

export function setIn<V = any>(source: V, paths: InternalNamePath, value: any): V {
  // 源数据不是对象
  if (!isObject(source)) return source
  return internalSet(source, paths, value)
}

export function getIn<V = any>(values: V, paths: InternalNamePath): any {
  for (let i = 0; i < paths.length; i++) {
    if (isNullish(values)) return undefined
    values = values[paths[i]]
  }
  // 空路径也返回 undefined
  return paths.length ? values : undefined
}

export function deleteIn<V = any>(source: V, paths: InternalNamePath): any {
  // 源数据不是对象
  if (!isObject(source)) return source
  return internalSet(source, paths, undefined, true)
}

// 合并数据且要获得全部的数据路径
export function mergeValue<V = any>(target: V, ...source: any[]): V {
  return target
}

// 获取 source 的全部路径
export function getPaths(source: any, parent: InternalNamePath = []): InternalNamePath[] {
  if (!isObject(source) && !isArray(source)) return []
  const isAnArray = isArray(source)
  if (isAnArray && source.length === 0) return [parent]
  return Object.entries(source).reduce((res, [key, value], index) => {
    const current = parent.concat(isAnArray ? index : key)
    if (isObject(value) || isArray(value)) return res.concat(getPaths(value, current))
    return res.concat([current])
  }, [] as InternalNamePath[])
}
