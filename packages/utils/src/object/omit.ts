import { hasItem } from '../array'

export function omit<T extends Record<string, any>, K extends keyof T>(
  source: T,
  excluded: readonly K[],
): Omit<T, K> {
  const target = {} as T

  const keys = Object.keys(source) as K[]

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]

    if (!hasItem(excluded as K[], key)) target[key] = source[key]
  }

  return target
}
