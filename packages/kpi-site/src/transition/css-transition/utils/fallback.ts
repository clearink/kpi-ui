import { isUndefined } from '@kpi/shared'

export default function fallback<T>(a: T | undefined, b: T) {
  return isUndefined(a) ? b : a
}
