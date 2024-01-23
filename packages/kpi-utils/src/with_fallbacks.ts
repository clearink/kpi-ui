import fallback from './fallback'

export default function withFallbacks<V extends Record<string, any>, T extends Partial<V>>(
  source: V,
  partial: T
) {
  const result: any = {}

  const keys = Object.keys(partial)

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]

    result[key] = fallback(source[key], partial[key])
  }

  return result as T
}
