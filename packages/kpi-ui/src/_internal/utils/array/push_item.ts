import { isArray } from '../is'

export function pushItem<T>(array: T[], items: T | T[]) {
  if (!isArray(items)) array.push(items)
  else for (let i = 0; i < items.length; i += 1) array.push(items[i])
  return array
}
