import { useMemo, useRef } from 'react'

export default function useStableCounter(init: number) {
  const ref = useRef(init)
  return useMemo(() => {
    return {
      get: () => ref.current,
      add: () => {
        ref.current += 1
      },
    }
  }, [])
}
