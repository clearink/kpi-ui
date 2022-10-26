import { isNumber, isArray, isObject, isNullish, isObjectLike, rawType } from '../../_utils'

import type { InternalNamePath } from '../internal_props'

// TODO: 改成非递归模式,递归性能不好
// 改成循环要怎么做呢?
function internalSet<V = any>(
  source: V,
  paths: InternalNamePath,
  value: any,
  removeUndefined = false
): V {
  const aaa = paths.reduce((res, path, i) => {
    // 最后一个值
    let attr = {} as V
    if (isArray(source)) attr = [...source] as unknown as V
    else if (isObject(source)) attr = { ...source }
    // source为基础类型时舍弃
    else if (isNumber(path)) attr = [] as unknown as V
    return res.concat({ attr, path })
  }, [] as any[])
  if (paths.length === 0) return value
  console.log(aaa)
  return aaa.concat({ done: true, value }).reduceRight(
    (res, item) => {
      const { done, value: $value, path, attr } = item
      return attr
    },
    { res: undefined }
  )
}

// TODO: 优化性能问题
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

// 合并对象(数组直接覆盖)
function internalMerge(target: any, source: any) {
  const targetType = rawType(target)
  const sourceType = rawType(source)

  if (targetType !== sourceType) return source

  // 为基本类型
  if (!isObjectLike(target)) return source

  // 数组和对象
  if (isObject(target) || isArray(target)) {
    const isAnArray = isArray(target)
    const newTarget = isAnArray ? [...target] : { ...target }
    return Object.entries(source).reduce((res, [key, value]) => {
      res[key] = internalMerge(res[key], value)
      return res
    }, newTarget)
  }

  // 其他非基础类型数据
  return target
}

// 合并数据且要获得全部的数据路径
export function mergeValue<V = any>(target: V, ...sources: any[]) {
  return sources.reduce((res, item) => {
    return internalMerge(res, item)
  }, target)
}
function test() {
  const start = performance.now()

  const a = setIn({}, ['username', 1], 123)
  // => {username:[, 123]}
  // Array.from({ length: 2000 }, (_, i) => i).reduce((res, i) => {
  //   const value = getIn(res, ['username', i])
  //   return setIn(res, ['username', i], value)
  // }, {})
  console.log('diff time(ms)', performance.now() - start)
}
test()
