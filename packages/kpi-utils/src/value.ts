import { hasItem } from './array'

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
