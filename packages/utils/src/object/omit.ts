export function omit<T extends Record<string, any>, K extends keyof T>(
  source: T,
  excluded: readonly K[],
): Omit<T, K> {
  const target = {} as T

  const keys = Object.keys(source) as K[]

  for (let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i]

    if (!excluded.includes(key)) target[key] = source[key]
  }

  return target
}
