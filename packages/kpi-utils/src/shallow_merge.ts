import { isUndefined } from './is'

export default function shallowMerge<R, T extends Record<string, any>>(source: R, defaults: T) {
  const result = { ...source } as Record<any, any>

  // eslint-disable-next-line no-restricted-syntax
  for (const key in defaults) if (isUndefined(result[key])) result[key] = defaults[key]

  return result as R & T
}

export function shallowMergeWithPick<R, T extends Record<string, any>, K extends keyof T>(
  source: R,
  defaults: T,
  keys: readonly K[]
) {
  const result = { ...source } as unknown as T

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i] as K
    if (isUndefined(result[key])) result[key] = defaults[key]
  }
  return result as R & Pick<T, K>
}
