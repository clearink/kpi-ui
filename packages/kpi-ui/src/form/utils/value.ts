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

// 浅拷贝 且 仅拷贝某条路径下的值
export function cloneWithPath<V>(source: V, paths: InternalNamePath) {
  if (!isObjectLike(source) || !paths.length) return source
  const [path, ...rest] = paths
  if (isObject(source) || isArray(source)) {
    const init = isArray(source) ? source.slice() : { ...source }
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
export function mergeValue<V = any>(target: V, ...sources: any[]): V {
  return sources.reduce((res, item) => {
    return internalMerge(res, item)
  }, target)
}
