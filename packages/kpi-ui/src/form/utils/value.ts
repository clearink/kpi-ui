import { isNumber, isArray, isObject, isNullish, isObjectLike, rawType, hasOwn } from '../../_utils'

import type { InternalNamePath } from '../internal_props'

// 不改变原始值
function internalSetIn<V = any>(
  source: V,
  paths: InternalNamePath,
  value: any,
  removeUndefined = false
): V {
  if (paths.length === 0) return value

  const [path, ...rest] = paths

  let attr = {} as V
  // 浅拷贝在大数据量场景下会有性能问题
  if (isArray(source) || isObject(source)) attr = source
  // source为基础类型时舍弃
  else if (isNumber(path)) attr = [] as unknown as V

  const $value = internalSetIn(attr[path], rest, value, removeUndefined)
  if ($value === undefined && removeUndefined) delete attr[path]
  else attr[path] = $value

  return attr
}

export function setIn<V = any>(source: V, paths: InternalNamePath, value: any): V {
  // 源数据不是对象
  if (!isObject(source)) return source
  return internalSetIn(source, paths, value)
}

// 不改变原始值
export function getIn<V = any>(values: V, paths: InternalNamePath): any {
  for (let i = 0; i < paths.length; i++) {
    if (isNullish(values)) return undefined
    values = values[paths[i]]
  }
  // 空路径也返回 undefined
  return paths.length ? values : undefined
}

// source 引用不变
export function deleteIn<V = any>(source: V, paths: InternalNamePath): any {
  // 源数据不是对象
  if (!isObject(source)) return source
  return internalSetIn(source, paths, undefined, true)
}

// 深拷贝 数组与对象
function internalCloneDeep(source: any, seen = new WeakSet()) {
  if (seen.has(source)) return source
  if (!isObjectLike(source)) return source

  seen.add(source)

  if (isObject(source) || isArray(source)) {
    const init = isArray(source) ? [] : {}
    return Object.entries(source).reduce((res, [key, value]) => {
      res[key] = internalCloneDeep(value, seen)
      return res
    }, init)
  }
  // 其他类型暂不需要
  return source
}

export function cloneDeep<V>(source: V) {
  return internalCloneDeep(source) as V
}

// 浅拷贝 且 仅拷贝某条路径下的值
export function cloneWithPath<V>(source: V, paths: InternalNamePath) {
  if (!isObjectLike(source) || !paths.length) return source
  const [path, ...rest] = paths
  if (isObject(source) || isArray(source)) {
    const init = isArray(source) ? [...source] : { ...source }
    // 不存在该值
    if (!hasOwn(init, path)) return init as V
    init[path] = cloneWithPath(init[path], rest)
    return init as V
  }
  // 其他类型暂时不处理
  return source
}

// 合并对象
function internalMerge(target: any, source: any) {
  const [targetType, sourceType] = [rawType(target), rawType(source)]

  if (targetType !== sourceType) return source

  // 为基本类型
  if (!isObjectLike(target)) return source

  // 数组直接覆盖
  if (isArray(target)) return source

  // 对象才需要合并
  if (isObject(target)) {
    return Object.entries(source).reduce((res, [key, value]) => {
      res[key] = internalMerge(res[key], value)
      return res
    }, target)
  }
  // 其他非基础类型数据
  return target
}

// 合并数据 不改变原始值
export function mergeValue<V = any>(target: V, ...sources: any[]) {
  return sources.reduce((res, item) => {
    return internalMerge(res, item)
  }, target)
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
