import fallback from './fallback'

export function withoutProperties<T extends Record<string, any>, K extends keyof T>(
  source: T,
  excluded: readonly K[]
): Omit<T, K> {
  const target = {} as T

  const keys = Object.keys(source) as K[]

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (excluded.indexOf(key) < 0) target[key] = source[key]
  }

  return target
}

export function pick<T extends Record<string, any>, K extends keyof T>(
  source: T,
  keys: readonly K[],
  detectPrototype = false
): Pick<T, K> {
  const result = {} as T

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i]

    if (detectPrototype && !(key in source)) continue

    result[key] = source[key]
  }

  return result
}

export function pickWithFallback<
  R extends Record<string, any>,
  T extends Record<string, any>,
  K extends keyof T
>(source: R, defaults: T, keys: readonly K[]) {
  const result = {} as Pick<T, K>

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i] as string
    result[key] = fallback(source[key], defaults[key])
  }

  return result
}

export function hasOwn<O>(obj: O, key: keyof any) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}
