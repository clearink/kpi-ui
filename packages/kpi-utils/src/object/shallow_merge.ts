import { isUndefined } from '../is'

export function shallowMerge<R, T extends Record<string, any>>(source: R, defaults: T) {
  const result = { ...source } as Record<any, any>

  const keys = Object.keys(defaults)

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (isUndefined(source[key])) result[key] = defaults[key]
  }

  return result as R & T
}
