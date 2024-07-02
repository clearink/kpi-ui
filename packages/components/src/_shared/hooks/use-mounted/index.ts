import { useCallback, useEffect, useRef } from 'react'

export function useMounted() {
  const ref = useRef(false)

  useEffect(() => {
    ref.current = true

    return () => { ref.current = false }
  }, [])

  return useCallback(() => ref.current, [])
}
