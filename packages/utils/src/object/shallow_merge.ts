import { isObject, isUndefined } from '../is'

export function shallowMerge<R, T extends Record<string, any>>(source: R, target: T) {
  const result = { ...source } as any

  const keys = Object.keys(target)

  for (let i = 0, len = keys.length; i < len; i++) {
    const k = keys[i]

    if (isUndefined(source[k])) result[k] = target[k]
  }

  return result as R & T
}

export function shallowMerges<V extends Record<string, any>>(source: V, ...partials: any[]) {
  let result = source

  for (let i = 0, len = partials.length; i < len; i++) {
    const partial = partials[i]

    if (isObject(partial)) result = shallowMerge(result, partial)
  }

  return result
}
