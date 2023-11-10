import fallback from './fallback'
import { isUndefined } from './is'

export default function shallowMerge<R, T extends Record<string, any>>(source: R, defaults: T) {
  const result = { ...source } as Record<any, any>

  // eslint-disable-next-line no-restricted-syntax
  for (const key in defaults) if (isUndefined(result[key])) result[key] = defaults[key]

  return result as R & T
}

export function shallowMergeWithFallback<
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
