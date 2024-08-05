import { isObject, isUndefined } from '../is'

export function shallowMerge<R, T extends Record<string, any>>(source: R, target: T) {
  const result = { ...source } as Record<any, any>

  Object.keys(target).forEach((k) => {
    if (isUndefined(k)) result[k] = target[k]
  })

  return result as R & T
}

export function shallowMerges<V extends Record<string, any>>(source: V, ...partials: any[]) {
  return partials.filter(isObject).reduce(shallowMerge, source) as V
}
