import { isNumber, isArray, isObject, isNullish } from '../../_utils'
import { PathItem } from '../props'

export function setIn<V = any>(source: V, paths: PathItem[], value: any): V {
  if (paths.length === 0) return value
  const [path, ...rest] = paths
  let attr = {} as V
  if (isArray(source)) attr = [...source] as unknown as V
  else if (isObject(source)) attr = { ...source }
  // source为基础类型时舍弃
  else if (isNumber(path)) attr = [] as unknown as V
  attr[path] = setIn(attr[path], rest, value)
  return attr
}

export function getIn<V = any>(values: V, paths: PathItem[]): any {
  for (let i = 0; i < paths.length; i++) {
    if (isNullish(values)) return undefined
    values = values[paths[i]]
  }
  // 空路径也返回 undefined
  return paths.length ? values : undefined
}
