import { isUndefined } from '@kpi-ui/utils'

export function useSemanticStyles<K extends string, V extends object>(
  root: V | undefined,
  semantics: Partial<Record<K, V>> | undefined,
) {
  const result = { ...semantics } as Partial<Record<K | 'root', V>>

  if (!isUndefined(root)) result.root = { ...root, ...result?.root }

  return result
}
