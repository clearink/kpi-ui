import { useDebounceState } from '_shared/hooks'
import { startTransition, useCallback } from 'react'

import type { FieldMeta } from '../../../props'

export function initFieldMeta(): FieldMeta {
  return {
    dirty: false,
    errors: [],
    mounted: false,
    name: [],
    touched: false,
    validating: false,
    warnings: [],
  }
}

export default function useMetaState() {
  const [state, setState] = useDebounceState(100, initFieldMeta)

  // prettier-ignore
  const update = useCallback((meta: FieldMeta) => {
    meta.mounted && startTransition(() => {
      setState(meta)
    })
  }, [setState])

  return [state, update] as const
}
