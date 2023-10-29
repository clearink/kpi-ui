import type { AnyObject } from '../types'

/**
 * @description 不处理原型数据
 */
export function omit<T extends AnyObject, K extends keyof T>(
  source: T,
  excluded: readonly K[]
): Omit<T, K> {
  const target = {} as T

  const keys = Object.keys(source) as K[]

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (!excluded.includes(key)) target[key] = source[key]
  }

  return target
}

export function pick<T extends AnyObject, K extends keyof T>(
  source: T,
  keys: readonly K[]
): Pick<T, K> {
  const result = {} as T

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i]
    if (key in source) result[key] = source[key]
  }

  return result
}

export function hasOwn<O extends unknown>(obj: O, key: keyof any) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}
