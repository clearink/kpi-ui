/* eslint-disable no-param-reassign */
import { isNumber, isArray, isObject, isNullish, isObjectLike, rawType, hasOwn } from '@kpi/shared'

import type { InternalNamePath } from '../internal_props'

function internalSetIn<V = any>(source: V, paths: InternalNamePath, value: any): V {
  if (paths.length === 0) return value

  const [path, ...rest] = paths

  let attr = {} as V
  if (isObject(source)) attr = { ...source }
  else if (isArray(source)) attr = source.slice() as unknown as V
  // source为基础类型时舍弃
  else if (isNumber(path)) attr = [] as unknown as V

  attr[path] = internalSetIn(attr[path], rest, value)

  return attr
}

export function setIn<V = any>(source: V, paths: InternalNamePath, value: any): V {
  // 源数据不是对象
  if (!isObject(source)) return source
  return internalSetIn(source, paths, value)
}

export function getIn<V = any>(values: V, paths: InternalNamePath): any {
  for (let i = 0; i < paths.length; i += 1) {
    if (isNullish(values)) return undefined
    values = values[paths[i]]
  }
  // 空路径也返回 undefined
  return paths.length ? values : undefined
}

function internalDeleteIn<V = any>(source: V, paths: InternalNamePath): V {
  if (paths.length === 0) return source

  // 帝国进行下一层
  const [attr, ...rest] = paths

  // source 不存在该属性, 不继续操作
  if (!hasOwn(source, attr)) return source

  // 需要删除了
  if (rest.length === 0) delete source[attr]
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
function internalMerge(target: any, source: any) {
  const targetType = rawType(target)
  const sourceType = rawType(source)

  if (targetType !== sourceType) return source

  // 为基本类型
  if (!isObjectLike(target)) return source

  // 数组直接覆盖
  if (isArray(target)) return source

  // 对象才需要合并
  if (isObject(target)) {
    return Object.entries(source).reduce((res, [key, value]) => {
      return { ...res, [key]: internalMerge(res[key], value) }
    }, target)
  }
  // 其他非基础类型数据
  return target
}

// 合并数据
export function mergeValue<V = any>(target: V, ...sources: any[]): V {
  const init = isArray(target) ? target.slice() : { ...target }

  return sources.reduce(internalMerge, init)
}

// 仅复制路径下的值
export function cloneWithPath<V>(source: V, paths: InternalNamePath) {
  if (!isObjectLike(source) || !paths.length) return source
  const [path, ...rest] = paths

  const init = isArray(source) ? [] : {}
  init[path] = cloneWithPath(source[path], rest)

  return init as V
}
