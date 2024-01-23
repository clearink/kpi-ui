import { hasItem } from './array'
import { isUndefined } from './is'

export function omit<T extends Record<string, any>, K extends keyof T>(
  source: T,
  excluded: readonly K[]
): Omit<T, K> {
  const target = {} as T

  const keys = Object.keys(source) as K[]

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]

    if (!hasItem(excluded as K[], key)) target[key] = source[key]
  }

  return target
}

export function pick<T extends Record<string, any>, K extends keyof T>(
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

export const hasOwn = Object.hasOwn
  ? Object.hasOwn.bind(null)
  : (o: object, v: PropertyKey) => Object.prototype.hasOwnProperty.call(o, v)

export function shallowEqual(prev: any, next: any) {
  return prev === next
}

export function shallowUnequal(prev: any, next: any) {
  return Object.is(prev, next)
}

export function shallowMerge<R, T extends Record<string, any>>(source: R, defaults: T) {
  const result = { ...source } as Record<any, any>

  const keys = Object.keys(defaults)

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (isUndefined(source[key])) result[key] = defaults[key]
  }

  return result as R & T
}
