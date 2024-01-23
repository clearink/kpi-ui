// utils
import { shallowMerge } from '../value'

export default function withDefaults<V extends Record<string, any>>(
  source: V,
  partial: Partial<V>
) {
  return shallowMerge(source, partial) as V
}
