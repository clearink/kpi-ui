// utils
import { isEqual } from '@kpi-ui/utils'
import useConstant from '../use-constant'
// types
import type { DependencyList } from 'react'

export default function useDeepMemo<T>(factory: () => T, deps?: DependencyList): T {
  const state = useConstant(() => ({ value: factory(), deps }))

  if (!isEqual(state.deps, deps)) {
    state.deps = deps
    state.value = factory()
  }

  return state.value
}
