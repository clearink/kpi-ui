/* eslint-disable @typescript-eslint/naming-convention */
import { toArray } from '@kpi-ui/utils'

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
