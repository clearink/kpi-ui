import { useRef, type DependencyList } from 'react'
import { isEqual } from '@kpi-ui/utils'

export interface MemoizeCache<T> {
  deps?: DependencyList
  value?: T
  init: boolean
}

export default function useDeepMemo<T>(factory: () => T, deps?: DependencyList): T {
  const ref = useRef<MemoizeCache<T>>({ init: true })

  if (ref.current.init || !isEqual(ref.current.deps, deps)) {
    ref.current = { init: false, value: factory(), deps }
  }

  return ref.current.value!
}
