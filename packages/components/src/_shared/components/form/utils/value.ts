import { hasOwn, isArray, isNullish, isNumber, isObject, rawType } from '@internal/utils'

import type { InternalNamePath } from '../props'

function internalSetIn<V = any>(source: V, paths: InternalNamePath, value: any): V {
  if (!paths.length) return value

  const [path, ...rest] = paths

  let attr = {} as V
  if (isObject(source)) attr = { ...source }
  else if (isArray(source)) attr = source.concat() as unknown as V
  // source为基础类型时舍弃
  else if (isNumber(path)) attr = [] as unknown as V

  attr[path] = internalSetIn(attr[path], rest, value)

  return attr
}

export function setIn<V = any>(source: V, paths: InternalNamePath, value: any): V {
  if (!isObject(source)) return source

  return internalSetIn(source, paths, value)
}

export function getIn<V = any>(values: V, paths: InternalNamePath): any {
  const len = paths.length

  for (let i = 0; i < len; i++) {
    if (isNullish(values)) return values
    values = values[paths[i]]
  }

  // 空路径返回 undefined
  return len ? values : undefined
}

function internalDeleteIn<V = any>(source: V, paths: InternalNamePath): V {
  if (!paths.length) return source

  const [attr, ...rest] = paths

  if (!hasOwn(source as any, attr)) return source

  if (!rest.length) delete source[attr]
  else internalDeleteIn(source[attr], rest)

  return source
}

// 删除指定字段
export function deleteIn<V = any>(source: V, paths: InternalNamePath): any {
  // 源数据不是对象
  if (!isObject(source)) return source

  return internalDeleteIn(source, paths)
}

// 合并对象
function internalMerge(target: any, source: any, map = new WeakMap()) {
  if (rawType(target) !== rawType(source)) return source

  if (!isObject(target)) return source

  if (map.has(target)) return map.get(target)

  // 数组直接覆盖
  if (isArray(target)) return source

  // 其他非基础类型数据
  if (!isObject(target)) return target

  const init = { ...target }

  map.set(target, init)

  return Object.entries(source).reduce((result, [key, value]) => {
    result[key] = internalMerge(result[key], value, map)

    return result
  }, init)
}

// 合并数据
export function mergeValue<V = any>(target: V, ...sources: any[]): V {
  const init = isArray(target) ? target.concat() : { ...target }

  return sources.reduce((result, current) => internalMerge(result, current), init)
}

// 仅复制路径下的值
export function cloneWithPath<V>(source: V, paths: InternalNamePath) {
  if (!isObject(source) || !paths.length) return source

  const [path, ...rest] = paths
  const init = isArray(source) ? [] : {}
  init[path] = cloneWithPath(source[path], rest)

  return init as V
}

export function hasOwnWithPath<V>(source: V, paths: InternalNamePath) {
  const len = paths.length

  for (let i = 0; i < len; i++) {
    const key = paths[i]

    if (!hasOwn(source as any, key)) return false

    source = source[key]
  }

  return !!len
}
