import { isArray } from '../is'

export function pushItem<T>(array: T[], items: T | T[]) {
  if (!isArray(items)) array.push(items)
  else for (let i = 0, len = items.length; i < len; i++) array.push(items[i])

  return array
}
