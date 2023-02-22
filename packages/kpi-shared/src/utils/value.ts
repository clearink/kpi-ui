import type { AnyObject } from '../types'

export function omit<T extends AnyObject, K extends keyof T>(
  obj: T,
  excluded: readonly K[]
): Omit<T, K> {
  const result = {} as T
  const sourceKeys = Object.keys(obj)

  for (let i = 0; i < sourceKeys.length; i += 1) {
    const key = sourceKeys[i] as K
    if (excluded.indexOf(key) >= 0) continue
    result[key] = obj[key]
  }
  return result
}

export function pick<T, K extends keyof T>(
  obj: T,
  keys: readonly K[],
  allowUndefined = false
): Pick<T, K> {
  const result = {} as T
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i]
    if (!allowUndefined && obj[key] === undefined) continue
    result[key] = obj[key]
  }
  return result
}

export function hasOwn<O extends unknown>(obj: O, key: keyof any) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}
