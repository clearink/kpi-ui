import { isPlainObject, isUndefined, shallowMerge } from '@internal/utils'

export function withDefaults<V extends Record<string, any>>(source: V, partial: Partial<V>) {
  return shallowMerge(source, partial) as V
}

// 能够深层次合并默认值
export function withDeepDefaults<V extends Record<string, any>>(source: V, partial: Partial<V>) {
  const result = { ...source } as any

  const keys = Object.keys(partial)

  for (let i = 0, len = keys.length; i < len; i++) {
    const k = keys[i]

    if (isUndefined(result[k])) result[k] = partial[k]
    else if (isPlainObject(result[k]) && isPlainObject(partial[k]))
      result[k] = withDeepDefaults(result[k], partial[k] as any)
  }

  return result as V
}
