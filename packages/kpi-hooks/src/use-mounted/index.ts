import { useCallback, useEffect, useRef } from 'react'

export default function useMounted() {
  const ref = useRef(false)

  useEffect(() => {
    ref.current = true

    // prettier-ignore
    return () => { ref.current = false }
  }, [])

  return useCallback(() => ref.current, [])
}
