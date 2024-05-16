import { isEqual } from '@kpi-ui/utils'
import { useMemo, type DependencyList } from 'react'
import useConstant from '../use-constant'

export default function useDeepMemo<T>(factory: () => T, deps?: DependencyList): T {
  const state = useConstant(() => ({ value: factory(), deps }))

  useMemo(() => {
    if (isEqual(state.deps, deps)) return

    state.deps = deps

    state.value = factory()
  }, [deps, factory, state])

  return state.value
}
