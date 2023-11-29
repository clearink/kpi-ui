import { isUndefined } from './is'

export default function fallback<T>(a: T | undefined, ...fallbacks: T[]) {
  if (!isUndefined(a)) return a
  return fallbacks.find((e) => !isUndefined(e))
}
