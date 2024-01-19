// utils
import { isEqual } from '@kpi-ui/utils'
import useConstant from '../use-constant'
// types
import type { DependencyList } from 'react'

export default function useDeepMemo<T>(factory: () => T, deps?: DependencyList): T {
  const store = useConstant(() => ({ value: factory(), deps }))

  if (!isEqual(store.deps, deps)) {
    store.deps = deps
    store.value = factory()
  }

  return store.value
}
