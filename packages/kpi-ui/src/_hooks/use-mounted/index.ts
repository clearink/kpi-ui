import { useLayoutEffect, useRef } from 'react'

export default function useMounted() {
  const ref = useRef(false)
  useLayoutEffect(() => {
    ref.current = true
    return () => {
      ref.current = false
    }
  }, [])
  return ref
}
