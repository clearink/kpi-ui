import { isNumber, isArray, isObject, isNullish } from '../../_utils'
import { PathItem } from '../props'

function internalSet<V = any>(
  source: V,
  paths: PathItem[],
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

export function setIn<V = any>(source: V, paths: PathItem[], value: any): V {
  return internalSet(source, paths, value)
}

export function getIn<V = any>(values: V, paths: PathItem[]): any {
  for (let i = 0; i < paths.length; i++) {
    if (isNullish(values)) return undefined
    values = values[paths[i]]
  }
  // 空路径也返回 undefined
  return paths.length ? values : undefined
}

export function deleteIn<V = any>(source: V, paths: PathItem[]): any {
  return internalSet(source, paths, undefined, true)
}
