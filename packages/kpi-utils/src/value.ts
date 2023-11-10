export function withoutProperties<T extends Record<string, any>, K extends keyof T>(
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

export function pick<T extends Record<string, any>, K extends keyof T>(
  source: T,
  keys: readonly K[],
  detectPrototype = false
): Pick<T, K> {
  const result = {} as T

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i]

    if (!(detectPrototype && key in source)) continue

    result[key] = source[key]
  }

  return result
}

export function hasOwn<O>(obj: O, key: keyof any) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}
