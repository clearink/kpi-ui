import { isUndefined } from '../is'

export function shallowMerge<R, T extends Record<string, any>>(source: R, target: T) {
  const result = { ...source } as Record<any, any>

  const keys = Object.keys(target)

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (isUndefined(source[key])) result[key] = target[key]
  }

  return result as R & T
}
