import { useMemo, useReducer, useRef } from 'react'

const reducer = (state, action) => {
  return { isMounting: false }
}
export default function useTransitionStore(init: number) {
  const [state, dispatch] = useReducer(reducer, { isMounting: false })
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
