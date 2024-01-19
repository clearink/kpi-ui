// types
import type { LiteralUnion } from '@kpi-ui/types'

export function toSemanticStyles<K extends string>(
  root: undefined | object,
  semantics: Partial<Record<LiteralUnion<'root', K>, object>> | undefined
) {
  return {
    root: { ...root, ...semantics?.root },
  } as Partial<Record<LiteralUnion<'root', K>, object>>
}
