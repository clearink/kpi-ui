import { isUndefined } from './is'

export default function withDefaults<V extends Record<string, any>>(
  source: V,
  partial: Partial<V>
) {
  const result: any = { ...source }

  const keys = Object.keys(partial)

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (isUndefined(source[key])) result[key] = partial[key]
  }

  return result as V
}
