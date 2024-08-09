import { isUndefined } from '../is'

export function fallback<T>(a: T | undefined, ...fallbacks: T[]) {
  return isUndefined(a) ? fallbacks.find(e => !isUndefined(e)) : a
}
