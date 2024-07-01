export function pick<T extends Record<string, any>, K extends keyof T>(
  source: T,
  keys: readonly K[],
): Pick<T, K> {
  const result = {} as T

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i]

    if (key in source) result[key] = source[key]
  }

  return result
}
