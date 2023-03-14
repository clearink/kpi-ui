/* eslint-disable @typescript-eslint/naming-convention */
import { isArray, toArray } from '@kpi/shared'

import type { NamePath } from '../props'

const SEPARATOR = '$_$'
// 获取名称字符串
export function _getName(namePath: NamePath) {
  return toArray(namePath).reduce<string>((result, item, index) => {
    return `${result}${index > 0 ? SEPARATOR : ''}${typeof item}:${item}`
  }, '')
}

export function isValidIndex(array: any[], ...positions: number[]) {
  const len = array.length
  return positions.every((position) => position < len && position >= 0)
}
// TODO: 移动到 @kpi/shared
export function pushItem<T>(array: T[], items: T | T[]) {
  if (!isArray(items)) array.push(items)
  else items.forEach((item) => pushItem(array, item))

  return array
}

export function removeItem<T>(array: T[], value: T) {
  const index = array.indexOf(value)
  index >= 0 && array.splice(index, 1)
}
