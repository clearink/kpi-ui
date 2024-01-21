import { isArray, isNullish } from './is'

/**
 * @desc 严格条件下，不是数组的都将返回空数组。
 * 非严格模式下 null，undefined 才返回空数组。
 */
export function toArray<T>(candidate?: T | T[] | null, strict = false): T[] {
  if (isNullish(candidate)) return []

  if (isArray(candidate)) return candidate

  return strict ? [] : [candidate]
}

export function pushItem<T>(array: T[], items: T | T[]) {
  if (!isArray(items)) array.push(items)
  else for (let i = 0; i < items.length; i += 1) array.push(items[i])
  return array
}

export function removeItem<T>(array: T[], value: T) {
  const index = array.indexOf(value)
  index > -1 && array.splice(index, 1)

  return array
}

export function hasItem<T>(array: T[], value: T) {
  return array.includes(value)
}
