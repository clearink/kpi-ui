import { useRef, type DependencyList } from 'react'
import isEqual from 'react-fast-compare'

export interface MemoizeCache<T> {
  deps: DependencyList | undefined
  cache: T
}
export default function useDeepMemo<T>(factory: () => T, deps?: DependencyList): T {
  const ref = useRef<MemoizeCache<T>>({ deps, cache: factory() })
  if (!isEqual(ref.current.deps, deps)) {
    ref.current.cache = factory()
    ref.current.deps = deps
  }
  return ref.current.cache
}
