import { isEqual } from '@kpi-ui/utils'
import { type DependencyList, useMemo } from 'react'

import { useConstant } from '../use-constant'

export function useDeepMemo<T>(factory: () => T, deps?: DependencyList): T {
  const state = useConstant(() => ({ deps, value: factory() }))

  useMemo(() => {
    if (isEqual(state.deps, deps)) return

    state.deps = deps

    state.value = factory()
  }, [deps, factory, state])

  return state.value
}
