export function omit<T extends Record<string, any>, K extends keyof T>(
  source: T,
  excluded: readonly K[],
): Omit<T, K> {
  const target = {} as T

  const keys = Object.keys(source) as K[]

  const set = new Set(excluded)

  for (let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i]

    if (!set.has(key)) target[key] = source[key]
  }

  return target
}
