import { useRef, type DependencyList } from 'react'
import isEqual from 'react-fast-compare'

export interface MemoizeCache<T> {
  deps: DependencyList | undefined
  cache: T
}

export default function useDeepMemo<T>(factory: () => T, deps?: DependencyList): T {
  const ref = useRef<MemoizeCache<T> | undefined>()

  if (!ref.current || !isEqual(ref.current.deps, deps)) {
    ref.current = { cache: factory(), deps }
  }

  return ref.current.cache!
}
