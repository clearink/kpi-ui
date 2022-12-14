export function omit<T, K extends keyof T>(obj: T, keys: readonly K[]): Omit<T, K> {
  const result = { ...obj }
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i]
    delete result[key]
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
