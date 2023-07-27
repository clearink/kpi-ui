/* eslint-disable no-bitwise */
import { isUndefined } from './is'

import type { AnyObject } from '../types'

export function omit<T extends AnyObject, K extends keyof T>(
  obj: T,
  excluded: readonly K[]
): Omit<T, K> {
  const result = {} as T

  const keys = Object.keys(obj) as K[]

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i]

    if (excluded.indexOf(key) < 0) result[key] = obj[key]
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

    if (!isUndefined(obj[key]) || allowUndefined) result[key] = obj[key]
  }
  return result
}

export function hasOwn<O extends unknown>(obj: O, key: keyof any) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}
