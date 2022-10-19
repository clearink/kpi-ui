import { useRef } from 'react'
import { useIsomorphicEffect } from '..'

export default function useMounted() {
  const ref = useRef(false)
  useIsomorphicEffect(() => {
    ref.current = true
    return () => {
      ref.current = false
    }
  }, [])
  return ref
}
