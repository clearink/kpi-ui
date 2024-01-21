import { isUndefined } from './is'

export function shallowEqual(prev: any, next: any) {
  return prev === next
}

export function shallowUnequal(prev: any, next: any) {
  return Object.is(prev, next)
}

export function shallowMerge<R, T extends Record<string, any>>(source: R, defaults: T) {
  const result = { ...source } as Record<any, any>

  // eslint-disable-next-line no-restricted-syntax
  for (const key in defaults) if (isUndefined(result[key])) result[key] = defaults[key]

  return result as R & T
}
