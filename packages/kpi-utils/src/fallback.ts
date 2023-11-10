import { isUndefined } from './is'

export default function fallback<T>(a: T | undefined, b: T) {
  return isUndefined(a) ? b : a
}
