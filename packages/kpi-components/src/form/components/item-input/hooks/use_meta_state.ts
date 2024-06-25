import { useDebounceState } from '_hooks'
import { useCallback, startTransition } from 'react'
// types
import type { FieldMeta } from '../../../props'

export function initFieldMeta(): FieldMeta {
  return {
    name: [],
    dirty: false,
    touched: false,
    validating: false,
    errors: [],
    warnings: [],
    mounted: false,
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
