/* eslint-disable no-bitwise */
import { toArray } from '@kpi/shared'

// TODO: 移动到 @kpi/shared
export function pushItem<T>(array: T[], items: T | T[], unique = false) {
  const arrayItems = toArray(items)

  for (let i = 0; i < arrayItems.length; i += 1) {
    const item = arrayItems[i]

    if (!unique || !~array.indexOf(item)) array.push(item)
  }

  return array
}

export function removeItem<T>(array: T[], value: T) {
  const index = array.indexOf(value)
  index >= 0 && array.splice(index, 1)
}
