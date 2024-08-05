import { isPlainObject, isUndefined, shallowMerge } from '@internal/utils'

export function withDefaults<V extends Record<string, any>>(source: V, partial: Partial<V>) {
  return shallowMerge(source, partial) as V
}

// 能够深层次合并默认值
export function withDeepDefaults<V extends Record<string, any>>(source: V, partial: Partial<V>) {
  const result = { ...source } as Record<any, any>

  const keys = Object.keys(partial)

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]

    // 直接赋值
    if (isUndefined(source[key])) { result[key] = partial[key] }
    else if (isPlainObject(source[key]) && isPlainObject(partial[key])) {
      // 深层合并?
      result[key] = withDeepDefaults(source[key], partial[key] as any)
    }
  }

  return result as V
}
