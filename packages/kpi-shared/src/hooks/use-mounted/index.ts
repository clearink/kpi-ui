import { useCallback, useRef } from 'react'
import useIsomorphicEffect from '../use-isomorphic-effect'

export default function useMounted() {
  const ref = useRef(false)
  useIsomorphicEffect(() => {
    ref.current = true
    return () => {
      ref.current = false
    }
  }, [])
  return useCallback(() => ref.current, [])
}

/** @private 仅仅是为了减少一次 rerender 平时尽量不要使用 */
export function useConstructor(callback: () => void) {
  const used = useRef(false)
  if (used.current) return
  callback()
  used.current = true
}
